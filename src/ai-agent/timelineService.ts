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

//  UPDATE
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

  // order
  const orderMatch = question.match(/order\s*(\d+)/i);
  if (orderMatch) {
    updateData.order = Number(orderMatch[1]);
    changes.push(`Order → ${orderMatch[1]}`);
  }


  // TAG UPDATE (FROM timelinePrompt AI)
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