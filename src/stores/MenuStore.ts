import { observable, action } from "mobx";
import { ParkPage } from "../pages/basic/Park";
import { EnterprisePage } from "../pages/basic/Enterprise";
import { MyEnterprisePage } from "../pages/basic/MyEnterprise";
import { UserPermissionPage } from "../pages/permission/UserPermission";
import { RolePermissionPage } from "../pages/permission/RolePermission";
import { EnterpriseScreenPage } from "../pages/screen/EnterpriseScreen";
import { ParkScreenPage } from "../pages/screen/ParkScreen";
import { MapMonitorPage } from "../pages/MapMonitor";
import { DynamicSourcePage } from "../pages/DynamicSource";
import { RuntimeDataPage } from "../pages/query/RuntimeData";
import { HistoryDataPage } from "../pages/query/HistoryData";
import { RankAnalysisPage } from "../pages/analysis/RankAnalysis";
import { ComparisonAnalysisPage } from "../pages/analysis/ComparisonAnalysis";
import { AlertManagePage } from "../pages/alert/AlertManage";
import { AlertSettingPage } from "../pages/alert/AlertSetting";
import { DataAuditPage } from "../pages/data/DataAudit";
import { DataManagePage } from "../pages/data/DataManage";
import { ReportPage } from "../pages/Report";

export class MenuStore {
  @observable collapsed = false;

  @action.bound
  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  @observable menus = [
    {
      icon: "dashboard",
      title: "基础信息",
      path: "/base",
      component: "",
      children: [
        {
          icon: "dashboard",
          title: "园区管理",
          path: "/base/park",
          component: ParkPage,
          children: []
        },
        {
          icon: "dashboard",
          title: "企业管理",
          path: "/base/enterprise",
          component: EnterprisePage,
          children: []
        },
        {
          icon: "dashboard",
          title: "我的企业",
          path: "/base/my-enterprise",
          component: MyEnterprisePage,
          children: []
        }
      ]
    },
    {
      icon: "dashboard",
      title: "用户权限",
      path: "/permission",
      component: "",
      children: [
        {
          icon: "dashboard",
          title: "用户管理",
          path: "/permission/user",
          component: UserPermissionPage,
          children: []
        },
        {
          icon: "dashboard",
          title: "角色管理",
          path: "/permission/role",
          component: RolePermissionPage,
          children: []
        }
      ]
    },
    {
      icon: "dashboard",
      title: "驾驶舱",
      path: "/screen",
      component: "",
      children: [
        {
          icon: "dashboard",
          title: "企业驾驶舱",
          path: "/screen/enterprise",
          component: EnterpriseScreenPage,
          children: []
        },
        {
          icon: "dashboard",
          title: "园区驾驶舱",
          path: "/screen/park",
          component: ParkScreenPage,
          children: []
        }
      ]
    },
    {
      icon: "dashboard",
      title: "地图监控",
      path: "/map",
      component: MapMonitorPage,
      children: []
    },
    {
      icon: "dashboard",
      title: "动态溯源",
      path: "/dynamic",
      component: DynamicSourcePage,
      children: []
    },
    {
      icon: "dashboard",
      title: "数据查询",
      path: "/query",
      component: "",
      children: [
        {
          icon: "dashboard",
          title: "实时数据查询",
          path: "/query/runtime",
          component: RuntimeDataPage,
          children: []
        },
        {
          icon: "dashboard",
          title: "历史数据查询",
          path: "/query/history",
          component: HistoryDataPage,
          children: []
        }
      ]
    },
    {
      icon: "dashboard",
      title: "统计分析",
      path: "/analysis",
      component: "",
      children: [
        {
          icon: "dashboard",
          title: "统计排名",
          path: "/analysis/rank",
          component: RankAnalysisPage,
          children: []
        },
        {
          icon: "dashboard",
          title: "对比分析",
          path: "/analysis/comparison",
          component: ComparisonAnalysisPage,
          children: []
        }
      ]
    },
    {
      icon: "dashboard",
      title: "告警处理",
      path: "/alert",
      component: "",
      children: [
        {
          icon: "dashboard",
          title: "告警管理",
          path: "/alert/manage",
          component: AlertManagePage,
          children: []
        },
        {
          icon: "dashboard",
          title: "告警设置",
          path: "/alert/setting",
          component: AlertSettingPage,
          children: []
        }
      ]
    },
    {
      icon: "dashboard",
      title: "数据质量",
      path: "/data",
      component: "",
      children: [
        {
          icon: "dashboard",
          title: "数据管理",
          path: "/data/manage",
          component: DataManagePage,
          children: []
        },
        {
          icon: "dashboard",
          title: "对比分析",
          path: "/data/audit",
          component: DataAuditPage,
          children: []
        }
      ]
    },
    {
      icon: "dashboard",
      title: "数据报表",
      path: "/report",
      component: ReportPage,
      children: []
    }
  ];
}
