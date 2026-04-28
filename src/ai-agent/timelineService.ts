import Timeline from "@/models/Timeline";

//  helpers 
const matchAndReplace = (text: string, oldVal: any, newVal: any) => {
  if (typeof oldVal !== "string" || typeof newVal !== "string") {
    return null;
  }

  const escaped = oldVal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");

  if (regex.test(text)) {
    return text.replace(regex, newVal);
  }

  return null;
};

const replaceTag = (html: string, oldTag: string, newTag: string) => {
  if (!oldTag || !newTag) return html;

  const openTag = new RegExp(`<${oldTag}(\\s|>)`, "gi");
  const closeTag = new RegExp(`</${oldTag}>`, "gi");

  return html
    .replace(openTag, `<${newTag}$1`)
    .replace(closeTag, `</${newTag}>`);
};

const isValidTag = (tag: string) => {
  return /^[a-zA-Z][a-zA-Z0-9]*$/.test(tag);
};

//  CREATE
export const createTimeline = async (category: string, html: string) => {
  await Timeline.create({
    category: category.toLowerCase().trim(),
    content: html,
    isActive: true,
    order: 0,
  });

  return `Timeline "${category}" created successfully`;
};

//  READ (same as tumhara)
export const handleRead = async (question: string) => {
  let timelines = [];

  if (question.toLowerCase().includes("traveling")) {
    timelines = await Timeline.find({
      category: { $regex: "traveling", $options: "i" }
    }).sort({ order: 1, createdAt: 1 }).lean();
  } else {
    timelines = await Timeline.find({})
      .sort({ order: 1, createdAt: 1 })
      .lean();
  }

  if (!timelines.length) return "No timeline data found";

  const strip = (h: string) =>
    h.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  return timelines
    .map((t, i) => `${i + 1}. ${t.category}: ${strip(t.content)}`)
    .join("\n");
};

// update
export const updateTimeline = async (question: string, data: any) => {
  const cleanCat = data?.category?.toLowerCase()?.trim();

  const existing = await Timeline.findOne({
    category: { $regex: `^${cleanCat}$`, $options: "i" },
  });

  if (!existing) return `No timeline found for category: ${cleanCat}`;

  let updateData: any = {};
  let changes: string[] = [];

  // isActive
  if (question.toLowerCase().includes("inactive")) {
    updateData.isActive = false;
    changes.push("Active: true → false");
  } else if (question.toLowerCase().includes("active")) {
    updateData.isActive = true;
    changes.push("Active: false → true");
  }

  // 🔥 ORDER LOGIC (AI + NUMBER + POSITION)
  let newOrder: number | null = null;

  const totalItems = await Timeline.countDocuments();

  // 🔥 1. AI POSITION BASED (BEST)
  if (data?.position) {
    if (data.position === "top" || data.position === "first") {
      newOrder = 0;
    }

    if (data.position === "last" || data.position === "bottom") {
      newOrder = totalItems - 1;
    }

    if (data.position === "second_last") {
      newOrder = totalItems - 2;
    }

    if (data.position === "middle") {
      newOrder = Math.floor(totalItems / 2);
    }
  }

  // 🔥 2. AI DIRECT ORDER
  if (data?.order !== undefined) {
    newOrder = Number(data.order) - 1; // convert 1-based → 0-based
  }

  // 🔥 3. FALLBACK (QUESTION PARSING)
  if (newOrder === null) {
    const match1 = question.match(/order\s*(\d+)/i);
    const match2 = question.match(/(\d+)(st|nd|rd|th)/i);
    const match3 = question.match(/(\d+)(?!.*\d)/);

    if (match1) newOrder = Number(match1[1]) - 1;
    else if (match2) newOrder = Number(match2[1]) - 1;
    else if (match3) newOrder = Number(match3[1]) - 1;
  }

  // 🔥 APPLY ORDER UPDATE
  if (newOrder !== null) {
    const oldOrder = existing.order;

    // clamp
    if (newOrder >= totalItems) newOrder = totalItems - 1;
    if (newOrder < 0) newOrder = 0;

    if (newOrder !== oldOrder) {
      if (newOrder < oldOrder) {
        // move up
        await Timeline.updateMany(
          {
            order: { $gte: newOrder, $lt: oldOrder },
            _id: { $ne: existing._id },
          },
          { $inc: { order: 1 } }
        );
      } else {
        // move down
        await Timeline.updateMany(
          {
            order: { $gt: oldOrder, $lte: newOrder },
            _id: { $ne: existing._id },
          },
          { $inc: { order: -1 } }
        );
      }

      updateData.order = newOrder;
      changes.push(`Order: ${oldOrder} → ${newOrder}`);
    }
  }

  // TAG UPDATE
  if (data?.tagUpdate) {
    const { oldTag, newTag } = data.tagUpdate;

    if (!oldTag || !newTag) {
      return "Invalid tag update request";
    }

    const updatedHTML = replaceTag(existing.content, oldTag, newTag);

    await Timeline.updateOne(
      { _id: existing._id },
      { $set: { content: updatedHTML } }
    );

    return `${oldTag} tag converted to ${newTag} in ${cleanCat}`;
  }

  // TEXT UPDATE
  if (data?.text && data.text.oldValue && data.text.newValue) {
    const { oldValue, newValue } = data.text;

    const result = matchAndReplace(existing.content, oldValue, newValue);

    if (result) {
      updateData.content = result;
      changes.push(`"${oldValue}" → "${newValue}"`);
    } else {
      return `Could not find "${oldValue}" in timeline content`;
    }
  }

  if (Object.keys(updateData).length === 0) {
    return "No changes detected";
  }

  await Timeline.updateOne(
    { _id: existing._id },
    { $set: updateData }
  );

  return `Timeline updated successfully:\n\n${changes.join("\n")}`;
};

//  DELETE
export const deleteTimeline = async (category: string) => {
  const res = await Timeline.deleteMany({
    category: { $regex: category, $options: "i" },
  });

  if (res.deletedCount === 0) {
    return "No matching timeline found";
  }

  return `${res.deletedCount} timeline(s) deleted`;
};