import request from "@/utils/request";
// 列表
export function BankList(data) {
  return request({
    url: "/api/bank/list",
    method: "post",
    data
  });
}
export function removeDup() {
  return request({
    url: "/api/bank/listByGroup",
    method: "post"
  });
}

export function BankCardAdd(data) {
  return request({
    url: "/api/bank/create",
    method: "post",
    data
  });
}

// 新增编辑
export function BankEdit(data) {
  return request({
    url: "/api/bank/update",
    method: "post",
    data
  });
}

export function BankChangeStatus(data) {
  return request({
    url: "/api/bank/set",
    method: "post",
    data
  });
}

export function BankDelete(data) {
  return request({
    url: "/api/bank/delete",
    method: "post",
    data
  });
}
