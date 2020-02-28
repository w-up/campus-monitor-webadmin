import moment from "moment";
import MomentZone from "moment-timezone";
require('moment/locale/zh-cn');

MomentZone.tz.setDefault("Asia/Shanghai");
moment.locale('zh-cn');
export const Moment = moment;
