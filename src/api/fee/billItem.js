import request from '@/utils/request'

const api_name = '/fee/billItem'

export default {
  //根据账单id查询账单列表
    getById(billId) {
      return request({
        url: `${api_name}/findBillItemByBillId/${billId}`,
        method: 'get'
      })
    }
}
