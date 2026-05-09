"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_cloud = require("../../utils/cloud.js");
const _sfc_main = {
  __name: "post-create",
  setup(__props) {
    const form = common_vendor.ref({
      title: "",
      content: "",
      images: [],
      category: "general",
      tags: [],
      visibility: "public"
    });
    const newTag = common_vendor.ref("");
    const categories = [
      { id: "general", label: "General", icon: "📌" },
      { id: "skill", label: "Skill Share", icon: "🎯" },
      { id: "gear", label: "Gear Talk", icon: "🧗" },
      { id: "partner", label: "Find Partner", icon: "👥" },
      { id: "event", label: "Event", icon: "🎉" }
    ];
    const visibilityOptions = [
      { id: "public", label: "Public", desc: "Everyone can see", icon: "🌍" },
      { id: "friends", label: "Friends Only", desc: "Only friends can see", icon: "👥" },
      { id: "private", label: "Private", desc: "Only you can see", icon: "🔒" }
    ];
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 9 - form.value.images.length,
        sourceType: ["album", "camera"],
        success: (res) => {
          form.value.images = [...form.value.images, ...res.tempFilePaths];
        }
      });
    };
    const removeImage = (index) => {
      form.value.images.splice(index, 1);
    };
    const addTag = () => {
      if (newTag.value.trim() && !form.value.tags.includes(newTag.value.trim())) {
        form.value.tags.push(newTag.value.trim());
        newTag.value = "";
      }
    };
    const removeTag = (index) => {
      form.value.tags.splice(index, 1);
    };
    const publish = async () => {
      if (!form.value.title.trim()) {
        common_vendor.index.showToast({ title: "Please enter title", icon: "none" });
        return;
      }
      if (!form.value.content.trim()) {
        common_vendor.index.showToast({ title: "Please enter content", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "Publishing..." });
      try {
        const result = await utils_cloud.cloud.post.createPost(form.value);
        if (result && result.success) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "Published!", icon: "success" });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1e3);
        } else {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: (result == null ? void 0 : result.message) || "Publish failed",
            icon: "none"
          });
        }
      } catch (err) {
        common_vendor.index.hideLoading();
        console.error("发布失败:", err);
        common_vendor.index.showToast({ title: "Publish failed", icon: "none" });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.o(publish),
        c: form.value.title,
        d: common_vendor.o(($event) => form.value.title = $event.detail.value),
        e: form.value.content,
        f: common_vendor.o(($event) => form.value.content = $event.detail.value),
        g: common_vendor.t(form.value.content.length),
        h: common_vendor.f(form.value.images, (img, index, i0) => {
          return {
            a: img,
            b: common_vendor.o(($event) => removeImage(index), index),
            c: index
          };
        }),
        i: form.value.images.length < 9
      }, form.value.images.length < 9 ? {
        j: common_vendor.o(chooseImage)
      } : {}, {
        k: common_vendor.f(categories, (cat, k0, i0) => {
          return {
            a: common_vendor.t(cat.icon),
            b: common_vendor.t(cat.label),
            c: cat.id,
            d: common_vendor.n({
              active: form.value.category === cat.id
            }),
            e: common_vendor.o(($event) => form.value.category = cat.id, cat.id)
          };
        }),
        l: common_vendor.f(form.value.tags, (tag, index, i0) => {
          return {
            a: common_vendor.t(tag),
            b: common_vendor.o(($event) => removeTag(index), index),
            c: index
          };
        }),
        m: form.value.tags.length < 5
      }, form.value.tags.length < 5 ? {
        n: common_vendor.o(addTag),
        o: newTag.value,
        p: common_vendor.o(($event) => newTag.value = $event.detail.value)
      } : {}, {
        q: common_vendor.f(visibilityOptions, (opt, k0, i0) => {
          return {
            a: common_vendor.t(opt.icon),
            b: common_vendor.t(opt.label),
            c: common_vendor.t(opt.desc),
            d: common_vendor.n({
              active: form.value.visibility === opt.id
            }),
            e: opt.id,
            f: common_vendor.n({
              active: form.value.visibility === opt.id
            }),
            g: common_vendor.o(($event) => form.value.visibility = opt.id, opt.id)
          };
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a3d1995a"]]);
wx.createPage(MiniProgramPage);
