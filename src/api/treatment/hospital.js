import request from '@/utils/request'

const api_name = '/treatment/hospital'

export default {
    getPageList(page, limit) {
        return request({
            url: `${api_name}/page/${page}/${limit}`,
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
        url: `${api_name}/page/${page}/${limit}`,
        method: 'post',
        data: query // 对象转json传到后台
      })
    },
    save(floor) {
      return request({
        url: `${api_name}/save`,
        method: 'post',
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
