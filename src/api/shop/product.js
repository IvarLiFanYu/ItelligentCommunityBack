import request from '@/utils/request'

const api_name = '/shop/product'

export default {
  getPageList(page, limit) {
    return request({
      url: `${api_name}/findAll/${page}/${limit}`,
      method: 'get',
    })
  },
  getPageListWithSearch(page, limit, query) {
    return request({
      url: `${api_name}/findAll/${page}/${limit}`,
      method: 'post',
      data: query // 对象转json传到后台
    })
  },
  save(product) {
    return request({
      url: `${api_name}`,
      method: 'post',
      data: product
    })
  },
  removeById(id){
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  }
}
