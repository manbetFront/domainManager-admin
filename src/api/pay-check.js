import request from "@/utils/request";
import qs from "qs";

export function OrderList(data) {
  return request({
    url: "/api/order/list",
    method: "post",
    data
  });
}

export function OrderCheck(data) {
  return request({
    url: "/api/order/audit",
    method: "post",
    data
  });
}

export function exportOrder(param) {
  return (
    process.env.VUE_APP_BASE_API + "/api/order/list?" + qs.stringify(param)
  );
}

export function getOrderNotice(data) {
  return request({
    url: "/api/order/notice",
    method: "post",
    data
  });
}

export function testPushOrder() {
  return request({
    url: "/api/order/mqtt",
    method: "post"
  });
}
