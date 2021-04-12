import request from '@/utils/request'

const api_name = '/assets/owner'

export default {
    getPageList(page, limit) {
        return request({
            url: `${api_name}/pageOwner/${page}/${limit}`,
            method: 'get',
        })
    },
    findAll() {
      return request({
        url: `${api_name}/findAll`,
        method: 'get',
      })
    },
    getPageListWithSearch(page, limit, query) {
      return request({
        url: `${api_name}/pageOwner/${page}/${limit}`,
        method: 'post',
        data: query // 对象转json传到后台
      })
    },
    getById(id) {
        return request({
          url: `${api_name}/getOwnerById/${id}`,
          method: 'get'
        })
      },
    getByIdCard(id) {
      return request({
        url: `${api_name}/getByIdCard/${id}`,
        method: 'get'
      })
    },
    save(floor) {
      return request({
        url: `${api_name}/save`,
        method: 'post',
        data: floor
      })
    },
    updateById(floor) {
      return request({
        url: `${api_name}/update`,
        method: 'put',
        data: floor
      })
    },
    removeById(id){
      return request({
        url: `${api_name}/${id}`,
        method: 'delete'
      })
    }
}
