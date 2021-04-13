import request from '@/utils/request'

const api_name = '/treatment/doctor'

export default {
    getPageList(page, limit) {
        return request({
            url: `${api_name}/page/${page}/${limit}`,
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
    save(doctor) {
      return request({
        url: `${api_name}/save`,
        method: 'post',
        data: doctor
      })
    },
    removeById(id){
      alert(id)
      return request({
        url: `${api_name}/${id}`,
        method: 'delete'
      })
    }
}
