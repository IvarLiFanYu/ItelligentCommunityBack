import request from '@/utils/request'

const api_name = '/assets/parkingSpace'

export default {
    getPageListWithSearch(page, limit, query) {
      return request({
        url: `${api_name}/page/${page}/${limit}`,
        method: 'post',
        data: query // 对象转json传到后台
      })
    },
    getPageList(page, limit, searchObj) {
        return request({
            url: `${api_name}/page/${page}/${limit}`,
            method: 'get',
            params: searchObj // url查询字符串或表单键值对
        })
    },
    getById(id) {
        return request({
          url: `${api_name}/get/${id}`,
          method: 'get'
        })
      },
    save(parkingSpace) {
      return request({
        url: `${api_name}/save`,
        method: 'post',
        data: parkingSpace
      })
    },
    updateById(parkingSpace) {
      return request({
        url: `${api_name}/update`,
        method: 'put',
        data: parkingSpace
      })
    },
    removeById(id){
      return request({
        url: `${api_name}/remove/${id}`,
        method: 'delete'
      })
    }
}
