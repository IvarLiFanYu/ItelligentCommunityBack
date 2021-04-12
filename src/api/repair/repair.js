import request from '@/utils/request'

const api_name = '/repair'

export default {
    getItemById(applyId) {
      return request({
        url: `/purchase/purchaseResource/getPurchaseResourceByApplyId/${applyId}`,
        method: 'get',
      })
    },
    findAll(page, limit) {
      return request({
        url: `${api_name}/pageRepair/${page}/${limit}`,
        method: 'get'
      })
    }
}
