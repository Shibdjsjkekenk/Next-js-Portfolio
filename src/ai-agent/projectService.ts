import Project from "@/models/Project";

// helpers 
const matchAndReplace = (text: string, oldVal: any, newVal: any) => {
    if (typeof oldVal !== "string" || typeof newVal !== "string") return null;

    const escaped = oldVal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    return regex.test(text) ? text.replace(regex, newVal) : null;
};

const replaceTag = (html: string, oldTag: string, newTag: string) => {
    if (!oldTag || !newTag) return html;

    const openTag = new RegExp(`<${oldTag}(\\s|>)`, "gi");
    const closeTag = new RegExp(`</${oldTag}>`, "gi");

    return html
        .replace(openTag, `<${newTag}$1`)
        .replace(closeTag, `</${newTag}>`);
};

// CREATE
export const createProject = async (html: string, link: string, image: string) => {
    await Project.create({
        content: html,
        projectLink: link,
        projectImage: image,
        isActive: true,
        order: 0,
    });

    return `Project created successfully`;
};

// READ
export const handleProjectRead = async () => {
    const projects = await Project.find({})
        .sort({ order: 1, createdAt: 1 })
        .lean();

    if (!projects.length) return "No project data found";

    const strip = (h: string) =>
        h.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

    return projects
        .map((p, i) => `${i + 1}. ${strip(p.content)}`)
        .join("\n");
};

// 🔥 UPDATE (TIMELINE LEVEL SMART)
export const updateProject = async (question: string, data: any) => {

    let existing = null;

    // 1️⃣ Try ID
    if (data?.id) {
        existing = await Project.findById(data.id);
    }

    // 2️⃣ 🔥 FALLBACK (INDEX BASED)
    if (!existing) {
        const projects = await Project.find().sort({ order: 1 });

        // 🔥 FIX: only pick target, not destination
        if (question.toLowerCase().includes("first")) {
            existing = projects[0];
        }

        // ❌ REMOVE THIS (IMPORTANT)
        // else if (question.toLowerCase().includes("last")) {
        //   existing = projects[projects.length - 1];
        // }

        // fallback number
        else {
            const match = question.match(/(\d+)/);
            if (match) {
                const index = Number(match[1]) - 1;
                existing = projects[index];
            }
        }
    }

    if (!existing) return "Project not found";

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

    // 🔥 ORDER LOGIC (SAME AS TIMELINE)
    let newOrder: number | null = null;
    const totalItems = await Project.countDocuments();

    // 1. AI POSITION
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

    // 2. AI ORDER
    if (data?.order !== undefined) {
        newOrder = Number(data.order) - 1;
    }

    // 3. 🔥 FALLBACK (IMPORTANT FIX)
    if (newOrder === null) {

        // 🔥 PRIORITY: POSITION FIRST
        if (question.toLowerCase().includes("last")) {
            newOrder = totalItems - 1;
        }
        else if (
            question.toLowerCase().includes("first") ||
            question.toLowerCase().includes("top")
        ) {
            newOrder = 0;
        }

        // 🔥 THEN NUMBER
        else {
            const match1 = question.match(/order\s*(\d+)/i);
            const match2 = question.match(/(\d+)(st|nd|rd|th)/i);
            const match3 = question.match(/(\d+)(?!.*\d)/);

            if (match1) newOrder = Number(match1[1]) - 1;
            else if (match2) newOrder = Number(match2[1]) - 1;
            else if (match3) newOrder = Number(match3[1]) - 1;
        }
    }

    // 🔥 APPLY ORDER
    if (newOrder !== null) {
        const oldOrder = existing.order;

        if (newOrder >= totalItems) newOrder = totalItems - 1;
        if (newOrder < 0) newOrder = 0;

        if (newOrder !== oldOrder) {

            if (newOrder < oldOrder) {
                await Project.updateMany(
                    {
                        order: { $gte: newOrder, $lt: oldOrder },
                        _id: { $ne: existing._id },
                    },
                    { $inc: { order: 1 } }
                );
            } else {
                await Project.updateMany(
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

        const updatedHTML = replaceTag(existing.content, oldTag, newTag);

        await Project.updateOne(
            { _id: existing._id },
            { $set: { content: updatedHTML } }
        );

        return `${oldTag} → ${newTag} updated`;
    }

    // TEXT UPDATE
    if (data?.text && data.text.oldValue && data.text.newValue) {
        const result = matchAndReplace(
            existing.content,
            data.text.oldValue,
            data.text.newValue
        );

        if (result) {
            updateData.content = result;
            changes.push(`Text updated`);
        } else {
            return `Text not found`;
        }
    }

    if (Object.keys(updateData).length === 0) {
        return "No changes detected";
    }

    await Project.updateOne(
        { _id: existing._id },
        { $set: updateData }
    );

    return `Project updated successfully:\n\n${changes.join("\n")}`;
};

// DELETE
export const deleteProject = async (id: string) => {
    const res = await Project.findByIdAndDelete(id);
    if (!res) return "Project not found";
    return "Project deleted successfully";
};