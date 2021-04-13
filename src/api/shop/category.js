import request from '@/utils/request'

const api_name = '/shop/category'

export default {
  getPageList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
    })
  },
  findAll() {
    return request({
      url: `${api_name}/findAll`,
      method: 'get',
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
