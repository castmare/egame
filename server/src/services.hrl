
% 初始化监控树
-define(CONST_SERICES_CHILDREN_SPEC_LIST, [
  % 应用最早初始化的地方，也是应用推出最后释放的地方，确保后面的服务释放的时候这里的资源都还在
  {init_base, {init_base, start_link, []}, permanent, infinity, supervisor, [init_base]},

  % % 随机数服务
  % {random_num_factory, {random_num_factory, start_link, []}, permanent, 2000, worker, [random_num_factory]},    

  % % 缓存服务，主要提供角色和玩家数据缓存接口
  {memcache, {memcache, start_link, []}, permanent, 2000, worker, [memcache]},

  % 子监控树，包括：和DB相关的初始化+各种ETS表的初始化
  {init_sup, {init_sup, start_link, []}, permanent, infinity, supervisor, [init_sup]},

  % 玩家DB缓写服务	
  {?USER_SLOW_DB, {slow_db, start_link, [[{write_interval, 100},
                              {write_per_time, 2}],
                              ?USER_SLOW_DB,
                              {user_db, prepare},
                              {user_db, insert},
                              {user_db, update}]},
       permanent, infinity, worker, [slow_db]},

  % 角色DB缓写服务	
  {?ROLE_SLOW_DB, {slow_db, start_link, [[{write_interval, 100},
                              {write_per_time, 2}],
                              ?ROLE_SLOW_DB,
                              {user_db, prepare},
                              {user_db, insert},
                              {user_db, update}]},
       permanent, infinity, worker, [slow_db]},
%% ------------------------------------------------------------------
%% 网络端口开放最好放在最后
%% ------------------------------------------------------------------
  {net_server_sup, {net_server_sup, start_link, []}, permanent, 2000, supervisor, [net_server_sup]}
%% ------------------------------------------------------------------
%% end 网络端口开放最好放在最后
%% ------------------------------------------------------------------
]).
