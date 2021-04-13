import request from '@/utils/request'

const api_name = '/shop/colonel'

export default {
  getPageList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
    })
  },
  getPageListWithSearch(page, limit, query) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'post',
      data: query // 对象转json传到后台
    })
  },
  save(category) {
    return request({
      url: `${api_name}`,
      method: 'post',
      data: category
    })
  },
  removeById(id){
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  }
}
