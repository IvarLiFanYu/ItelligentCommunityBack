import request from '@/utils/request'

const api_name = '/assets/parkingArea'

export default {
    findAll() {
      return request({
        url: `${api_name}/findAll`,
        method: 'get'
      })
    },
    getPageList(page, limit) {
        return request({
            url: `${api_name}/page/${page}/${limit}`,
            method: 'get'
        })
    },
    getById(id) {
        return request({
          url: `${api_name}/get/${id}`,
          method: 'get'
        })
      },
    save(parkingArea) {
      return request({
        url: `${api_name}/save`,
        method: 'post',
        data: parkingArea
      })
    },
    updateById(parkingArea) {
      return request({
        url: `${api_name}/update`,
        method: 'put',
        data: parkingArea
      })
    },
    removeById(id){
      return request({
        url: `${api_name}/${id}`,
        method: 'delete'
      })
    }
}
