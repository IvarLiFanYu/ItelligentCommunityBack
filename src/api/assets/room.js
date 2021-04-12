import request from '@/utils/request'

const api_name = '/assets/room'

export default {
    unBindOwner(ownerRoom){
      return request({
        url: `${api_name}/unBindOwner`,
        data: ownerRoom,
        method: 'post'
      })
    },
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
    getById(id) {
        return request({
          url: `${api_name}/get/${id}`,
          method: 'get'
        })
      },
    save(room) {
      return request({
        url: `${api_name}/save`,
        method: 'post',
        data: room
      })
    },
    updateById(room) {
      return request({
        url: `${api_name}/update`,
        method: 'put',
        data: room
      })
    },
    removeById(id){
      return request({
        url: `${api_name}/${id}`,
        method: 'delete'
      })
    },
   bindOwner(ownerRoomVo){
    return request({
        url: `${api_name}/bindOwner`,
        data: ownerRoomVo,
        method: 'post'
      })
    }
}
