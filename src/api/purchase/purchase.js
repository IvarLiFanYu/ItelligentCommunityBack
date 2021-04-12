import request from '@/utils/request'

const api_name = '/purchase/purchaseApply'

export default {
      getItemById(applyId) {
        return request({
          url: `/purchase/purchaseResource/getPurchaseResourceByApplyId/${applyId}`,
          method: 'get',
        })
      },
      findAll(page, limit) {
        return request({
          url: `${api_name}/pagePurchaseApply/${page}/${limit}`,
          method: 'get',
        })
      },
      deploy(id) {
        return request({
          url: `${api_name}/flow/deployment/${id}`,
          method: 'put'
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
