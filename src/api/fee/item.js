import request from '@/utils/request'

const api_name = '/fee/item'

export default {
    bindItem(itemRoom){
      return request({
        url: `${api_name}/bindItem`,
        data: itemRoom,
        method: 'post'
      })
    },
    unBindItem(itemRoom){
      return request({
        url: `${api_name}/unBindItem`,
        data: itemRoom,
        method: 'post'
      })
    },
    getPageList(page, limit) {
        return request({
            url: `${api_name}/itemApply/${page}/${limit}`,
            method: 'get',
        })
    },
    findRoomItem() {
        return request({
          url: `${api_name}/findRoomItem`,
          method: 'get',
        })
      },
    findSpaceItem() {
      return request({
        url: `${api_name}/findSpaceItem`,
        method: 'get',
      })
    },
    getById(id) {
        return request({
          url: `${api_name}/getitemById/${id}`,
          method: 'get'
        })
      },
    save(item) {
      return request({
        url: `${api_name}/save`,
        method: 'post',
        data: item
      })
    },
    updateById(item) {
      return request({
        url: `${api_name}/update`,
        method: 'put',
        data: item
      })
    },
    removeById(id){
      return request({
        url: `${api_name}/${id}`,
        method: 'delete'
      })
    },
    findAll(){
    return request({
      url: `${api_name}/findAll`,
      method: 'get'
    })
  }
}
