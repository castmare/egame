%%% 记录结构定义

%% 登录参数
-record(login_param, {
	device_id,
	svr_id,
	from,
	os,
	os_version,
	device,
	lang,
	region
}).

%% 玩家记录
-record(user, {
	uid,
	device_id,
	svr_id,
	uuid,
	create_time,
	from_type,
	login_time,
	last_login_ip,
	userdict,
	roles = []
}).

%% 角色摘要记录
-record(role_summary, {
	rid,
	uid,
	eid,
	name,
	select_time
}).


%% 角色记录
-record(role, {
	rid,
	uid,
	eid,
	is_robot = false,
	create_time,
	select_time,
	name_card,
	roledict,
	level,
	exp
}).

%% 名称卡片记录
-record(name_card, {
	name,
	last_set_time
}).


