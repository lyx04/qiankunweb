<template>
  <div>
    <template v-for="item in this.navMenu">
      <el-submenu
        :key="item.menuId"
        :index="String(item.menuId)"
        v-if="item.children && item.children.length > 0"
        :popper-append-to-body="false"
        :class="
          item.parentId ? 'submenu-item submenu-children-item' : 'submenu-item'
        "
      >
        <template slot="title">
          <span slot="title">{{ item.menuName }}</span>
        </template>
        <menu-tree :navMenu="item.children"></menu-tree>
      </el-submenu>
      <el-menu-item
        :key="item.menuId"
        :index="String(item.menuId)"
        :permsId="`${item.perms}`"
        v-if="
          ((item.perms && item.perms.length > 0) || permissions == '*:*:*') &&
            item.children &&
            item.children.length == 0
        "
        v-hasPermi="[`${item.perms}`]"
      >
        <span slot="title">{{ item.menuName }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "MenuTree",
  data() {
    return {
      enterpriseProperty: JSON.parse(sessionStorage.getItem("userInfo"))
        .enterpriseProperty,
      permissions: JSON.parse(sessionStorage.getItem("permissions"))[0]
    };
  },
  props: ["navMenu"],
  methods: {
    menuparent(rows) {
      if (JSON.parse(sessionStorage.getItem("permissions"))[0] === "*:*:*") {
        return true;
      } else {
        return this.checkOwnSameItem(
          rows.perms,
          JSON.parse(sessionStorage.getItem("permissions"))
        );
      }
    },
    checkOwnSameItem(arr1, arr2) {
      for (var s in arr1) {
        for (var x in arr2) {
          if (arr1[s] == arr2[x]) {
            return true;
          }
        }
      }
    }
  }
};
</script>
