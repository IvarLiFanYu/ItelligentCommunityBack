import request from '@/utils/request'

const api_name = '/assets/unit'

export default {
    getPageList(page, limit) {
        return request({
            url: `${api_name}/page/${page}/${limit}`,
            method: 'get'
        })
    },
    findByFloorId(floorId) {
      return request({
        url: `${api_name}/${floorId}`,
        method: 'get'
      })
    },
    getById(id) {
        return request({
          url: `${api_name}/get/${id}`,
          method: 'get'
        })
      },
    getPageListWithSearch(page, limit, query) {
      return request({
        url: `${api_name}/pageUnit/${page}/${limit}`,
        method: 'post',
        data: query // 对象转json传到后台
      })
    },
    findAll() {
      return request({
        url: `${api_name}/findAll`,
        method: 'get',
      })
    },
    save(unit) {
      return request({
        url: `${api_name}/save`,
        method: 'post',
        data: unit
      })
    },
    updateById(unit) {
      return request({
        url: `${api_name}/update`,
        method: 'put',
        data: unit
      })
    },
    removeById(id){
      return request({
        url: `${api_name}/${id}`,
        method: 'delete'
      })
    }
}
