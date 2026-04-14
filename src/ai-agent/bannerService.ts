import Banner from "@/models/Banner";

const matchAndReplace = (text: string, oldVal: string, newVal: string) => {
    const escaped = oldVal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i"); // case-insensitive

    if (regex.test(text)) {
        return text.replace(regex, newVal);
    }

    return null;
};

const similarity = (a: string, b: string) => {
    a = a.toLowerCase();
    b = b.toLowerCase();

    let matches = 0;
    const len = Math.min(a.length, b.length);

    for (let i = 0; i < len; i++) {
        if (a[i] === b[i]) matches++;
    }

    return matches / Math.max(a.length, b.length);
};

const fuzzyReplace = (text: string, oldVal: string, newVal: string) => {
    const words = text.split(" ");

    let replaced = false;

    const updatedWords = words.map((word) => {
        const score = similarity(word, oldVal);

        if (score > 0.6) { // threshold
            replaced = true;
            return newVal;
        }

        return word;
    });

    return replaced ? updatedWords.join(" ") : null;
};

// CREATE
export const createBanner = async (data: any) => {
    const newBanner = await Banner.create({
        title: data?.title?.value || "",
        paragraph: data?.paragraph?.value || "",
        italicTitle: data?.italicTitle?.value || "",
        image: data?.image?.value || "",
    });

    return "Banner created successfully";
};

// READ
export const getBanner = async (fields: string[] = []) => {
    const banners = await Banner.find({}).sort({ createdAt: -1 }).lean();

    if (!banners.length) return "No banner found";

    return banners
        .map((b, i) => {
            let output = `${i + 1}.\n`;

            const showAll = !fields || fields.length === 0;

            if (showAll || fields.includes("title")) {
                output += `Title: ${b.title}\n`;
            }

            if (showAll || fields.includes("italicTitle")) {
                output += `Italic: ${b.italicTitle}\n`;
            }

            if (showAll || fields.includes("paragraph")) {
                output += `Paragraph: ${b.paragraph}\n`;
            }

            if (showAll || fields.includes("image")) {
                output += `Image: ${b.image ? "Available ✅" : "Not Available ❌"}\n`;
            }

            if (showAll || fields.includes("isActive")) {
                output += `Active: ${b.isActive}\n`;
            }

            return output;
        })
        .join("\n");
};

//  UPDATE
export const updateBanner = async (question: string, data: any) => {
    const existing = await Banner.findOne({});

    if (!existing) return "No banner found";

    let updateData: any = {};
    let changes: string[] = [];

    // isActive
    if (question.toLowerCase().includes("inactive")) {
        updateData.isActive = false;
        changes.push(`Active: true → false`);
    } else if (question.toLowerCase().includes("active")) {
        updateData.isActive = true;
        changes.push(`Active: false → true`);
    }

    //  TEXT UPDATE (LIKE TIMELINE)
    if (data?.text && data.text.oldValue && data.text.newValue) {
        const { oldValue, newValue } = data.text;

        let updated = false;

        //  TEXT UPDATE (LIKE TIMELINE)
        if (data?.text && data.text.oldValue && data.text.newValue) {
            const { oldValue, newValue } = data.text;

            let updated = false;

            //  TITLE
            if (existing.title) {
                let result = matchAndReplace(existing.title, oldValue, newValue);

                // fallback fuzzy
                if (!result) {
                    result = fuzzyReplace(existing.title, oldValue, newValue);
                }

                if (result) {
                    updateData.title = result;
                    changes.push(`Title: "${oldValue}" → "${newValue}"`);
                    updated = true;
                }
            }

            //  PARAGRAPH
            if (existing.paragraph) {
                let result = matchAndReplace(existing.paragraph, oldValue, newValue);

                if (!result) {
                    result = fuzzyReplace(existing.paragraph, oldValue, newValue);
                }

                if (result) {
                    updateData.paragraph = result;
                    changes.push(`Paragraph: "${oldValue}" → "${newValue}"`);
                    updated = true;
                }
            }

            //  ITALIC
            if (existing.italicTitle) {
                let result = matchAndReplace(existing.italicTitle, oldValue, newValue);

                if (!result) {
                    result = fuzzyReplace(existing.italicTitle, oldValue, newValue);
                }

                if (result) {
                    updateData.italicTitle = result;
                    changes.push(`Italic: "${oldValue}" → "${newValue}"`);
                    updated = true;
                }
            }

            if (!updated) {
                return `Could not find "${oldValue}" in banner content.`;
            }
        }
    }

    if (Object.keys(updateData).length === 0) {
        return "No changes detected";
    }

    await Banner.updateOne({ _id: existing._id }, { $set: updateData });

    return `Banner updated successfully:\n\n${changes.join("\n")}`;
};

//  DELETE
export const deleteBanner = async (target: any) => {
  const banners = await Banner.find({})
    .sort({ createdAt: 1 })
    .lean();

  if (!banners.length) return "No banner found";

  // 🔥 LAST
  if (target?.type === "last") {
    const last = banners[banners.length - 1];

    await Banner.deleteOne({ _id: last._id });

    return `Last banner deleted:\nTitle: ${last.title}`;
  }

  // 🔥 FIRST
  if (target?.type === "first") {
    const first = banners[0];

    await Banner.deleteOne({ _id: first._id });

    return `First banner deleted:\nTitle: ${first.title}`;
  }

  // 🔥 INDEX
  if (target?.type === "index") {
    const index = target.value - 1;

    if (index < 0 || index >= banners.length) {
      return "Invalid index";
    }

    const item = banners[index];

    await Banner.deleteOne({ _id: item._id });

    return `Banner ${target.value} deleted:\nTitle: ${item.title}`;
  }

  // 🔥 MATCH (SMART TEXT)
  if (target?.type === "match") {
    const res = await Banner.deleteMany({
      $or: [
        { title: { $regex: target.value, $options: "i" } },
        { paragraph: { $regex: target.value, $options: "i" } },
        { italicTitle: { $regex: target.value, $options: "i" } }
      ]
    });

    if (res.deletedCount === 0) {
      return "No matching banner found";
    }

    return `${res.deletedCount} banner(s) deleted successfully`;
  }

  return "Invalid delete request";
};