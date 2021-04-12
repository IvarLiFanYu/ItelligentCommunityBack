import request from '@/utils/request'

const api_name = '/notice/message'

export default {
      findAll(page, limit) {
        return request({
          url: `${api_name}/pageNotice/${page}/${limit}`,
          method: 'get',
        })
      },
      findByQuery(page, limit, query) {
        return request({
          url: `${api_name}/pageNotice/${page}/${limit}`,
          method: 'post',
          data: query
        })
      },
      save(resource) {
        return request({
          url: `${api_name}/save`,
          method: 'post',
          data: resource
        })
      },
      removeById(id){
        return request({
          url: `${api_name}/${id}`,
          method: 'delete'
        })
      }
}
