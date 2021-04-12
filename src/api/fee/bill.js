import request from '@/utils/request'

const api_name = '/fee/bill'

export default {
    callBill() {
      return request({
        url: `${api_name}/call`,
        method: 'get',
      })
    },
    findAll(page, limit) {
        return request({
            url: `${api_name}/findAll/${page}/${limit}`,
            method: 'get',
        })
    },
    getById(id) {
      return request({
        url: `${api_name}/getBillItemById/${id}`,
        method: 'get'
      })
    },
    save(item) {
      return request({
        url: `${api_name}/save`,
        method: 'post',
        data: item
      })
    },
    updateById(item) {
      return request({
        url: `${api_name}/update`,
        method: 'put',
        data: item
      })
    },
    removeById(id){
      return request({
        url: `${api_name}/${id}`,
        method: 'delete'
      })
    }
}
