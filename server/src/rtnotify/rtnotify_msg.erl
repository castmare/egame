%%实时信息推送网络消息

-module(rtnotify_msg).
-author('zhangrenai').
-include("msg/up_pb.hrl").
-include("msg/down_pb.hrl").

-export([build_rtnotify_register_reply/1, 
  build_rtnotify_keepalive_reply/1,
  build_rtnotify_callback_reply/1]).

build_rtnotify_register_reply(Ret) ->
  #down_msg{ 
    rtnotify = #rtnotify_reply{
      register = Ret
    } 
  }.

build_rtnotify_keepalive_reply(ClientTime) ->
  #down_msg{ 
    rtnotify = #rtnotify_reply{
      keepalive = {rtnotify_keepalive_reply, ClientTime}
    } 
  }.

build_rtnotify_callback_reply(Data) ->
  #down_msg{ 
    rtnotify = #rtnotify_reply{
      callback = {rtnotify_callback_reply, Data}
    } 
  }.
