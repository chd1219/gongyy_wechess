<?php
/**
 * 象棋服务模块微站定义
 *
 * @author 宫易
 * @url http://bbs.we7.cc/
 */
defined('IN_IA') or exit('Access Denied');

class gongyy_wechessModuleSite extends WeModuleSite {

	public $_appid = '';
	public $_appsecret = '';
	public $_accountlevel = '';
	public $_uniacid = '';
	public $_fromuser = '';
	public $_nickname = '';
	public $_headimgurl = '';
	public $openid = '';
	public $_auth2_openid = '';
	public $_auth2_nickname = '';
	public $_auth2_headimgurl = '';
	public $table_member = 'mc_members';
	public $table_setting = 'gongyy_wechess_setting';
	public $table_category = 'gongyy_wechess_category';
	public $table_chess = 'gongyy_wechess_chess';
	public $table_user = 'gongyy_wechess_user';
	public $table_player = 'gongyy_wechess_player';
	public $table_collect = 'gongyy_wechess_collect';
	public $table_follow = 'gongyy_wechess_follow';
	public $table_core_cache = 'core_cache';
	public $table_feedback = 'gongyy_wechess_feedback';
	public $table_user_setting = 'gongyy_wechess_user_setting';
	public $table_comments = 'gongyy_wechess_comments';
	public $table_comments_user = 'gongyy_wechess_comments_user';
	public $table_prize_user = 'gongyy_wechess_prize_user';
	public $table_prize = 'gongyy_wechess_prize';
	public $table_credit_order = 'gongyy_wechess_credit_order';
	public $table_credit_log = 'gongyy_wechess_credit_log';
	public $table_operation_log = 'gongyy_wechess_operation_log';
	public $table_chessrecord = 'gongyy_wechess_chessrecord';

	/***************************** 初始化 *********************************/
	function __construct() {
		global $_W, $_GPC;
		$this -> _fromuser = $_W['fans']['from_user'];
		$this -> _uniacid = $_W['uniacid'];
		$account = $_W['account'];

		$this -> _auth2_openid = 'auth2_openid_' . $_W['uniacid'];
		$this -> _auth2_nickname = 'auth2_nickname_' . $_W['uniacid'];
		$this -> _auth2_headimgurl = 'auth2_headimgurl_' . $_W['uniacid'];

		$this -> _appid = '';
		$this -> _appsecret = '';
		$this -> _accountlevel = $account['level'];

		if ($this -> _accountlevel == 4) {
			$this -> _appid = $account['key'];
			$this -> _appsecret = $account['secret'];
		}

	}

	/*****************************   WEB方法  *********************************/
	/* 模块设置 */
	public function doWebSetting() {
		$this -> __web(__FUNCTION__);
	}

	/* 分类管理 */
	public function doWebCategory() {
		$this -> __web(__FUNCTION__);
	}

	/* 用户管理 */
	public function doWebUser() {
		$this -> __web(__FUNCTION__);
	}

	/* 棋谱管理 */
	public function doWebChess() {
		$this -> __web(__FUNCTION__);
	}

	/* 棋手管理 */
	public function doWebPlayer() {
		$this -> __web(__FUNCTION__);
	}

	/* 棋手管理 */
	public function doWebOrder() {
		$this -> __web(__FUNCTION__);
	}

	/* 用户反馈管理 */
	public function doWebFeedback() {
		$this -> __web(__FUNCTION__);
	}
	
	/*走棋记录*/
	public function doWebChessrecord() {
		$this -> __web(__FUNCTION__);
	}

	/***************************** Mobile方法 *********************************/

	/* APP首页 */
	public function doMobileIndex() {
		$this -> __mobile(__FUNCTION__);
	}

	/* 棋手库功能  */
	public function doMobilePlayer() {
		$this -> __mobile(__FUNCTION__);
	}

	/* 棋手个人中心  */
	public function doMobileCenter() {
		$this -> __mobile(__FUNCTION__);
	}

	/* 发布功能 */
	public function doMobilePublish() {

		$this -> __mobile(__FUNCTION__);
	}

	/* 测试功能 */
	public function doMobileTest() {
		global $_W, $_GPC;
		$uniacid = $_W['uniacid'];
		$op = $operation = $_GPC['op'] ? $_GPC['op'] : 'display';
		include_once 'mobile/test.php';
		//$this->__mobile(__FUNCTION__);
	}

	/* 个人中心 */
	public function doMobileSelf() {
		$this -> __mobile(__FUNCTION__);
	}

	/* 搜索中心首页 */
	public function doMobileSearch() {
		$this -> __mobile(__FUNCTION__);
	}

	/* 棋谱操作 */
	public function doMobileChess() {
		$this -> __mobile(__FUNCTION__);
	}

	/* 评论点赞 */
	public function doMobileComment() {
		$this -> __mobile(__FUNCTION__);
	}

	/* 引导关注 */
	public function doMobileFollow() {
		$this -> __mobile(__FUNCTION__);
	}

	public function doMobilePay() {
		$this -> __mobile(__FUNCTION__);
	}

	/*
	 * 积分充值
	 * 此积分与微擎系统积分打通，共用mc_members表的credit1字段
	 */
	public function doMobileCredit() {
		$this -> __mobile(__FUNCTION__);
	}

	public function doMobileVip() {
		$this -> __mobile(__FUNCTION__);
	}

	/* 测试前端框架和脚本 */
	public function doMobileMyui() {
		$this -> __mobile(__FUNCTION__);
	}
	
	/*走棋记录*/
	public function doMobileChessrecord() {
		$this -> __mobile(__FUNCTION__);
	}

	/************************************************ 公共方法 *************************************/
	public function __web($f_name) {
		global $_W, $_GPC;
		$uniacid = $_W['uniacid'];
		$op = $operation = $_GPC['op'] ? $_GPC['op'] : 'display';

		$setting = pdo_fetch("SELECT * FROM " . tablename($this -> table_setting) . " WHERE uniacid =:uniacid LIMIT 1", array(':uniacid' => $uniacid));
		$user_setting = pdo_fetch("SELECT * FROM " . tablename($this -> table_user_setting) . " WHERE uniacid =:uniacid AND openid = :openid LIMIT 1", array(':uniacid' => $uniacid, ':openid' => $_W['openid']));

		include_once 'web/' . strtolower(substr($f_name, 5)) . '.php';
	}

	public function __mobile($f_name) {

		global $_W, $_GPC, $listnum;
		$uniacid = $_W['uniacid'];
		$op = $operation = $_GPC['op'] ? $_GPC['op'] : 'display';
		$categories = pdo_fetchall("SELECT * FROM " . tablename($this -> table_category) . " WHERE uniacid='{$uniacid}' ORDER BY displayorder DESC");
		$uid = intval($_GPC['uid']);
		/*$url = $_W['siteroot'] .'app/'. $this->createMobileUrl('index', array('uid'=>$uid));*/
		$url = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'] . '?' . $_SERVER['QUERY_STRING'];
		//获取当前跳转的链接地址
		if (isset($_COOKIE[$this -> _auth2_openid])) {
			$openid = $_COOKIE[$this -> _auth2_openid];
			$nickname = $_COOKIE[$this -> _auth2_nickname];
			$headimgurl = $_COOKIE[$this -> _auth2_headimgurl];
		} else {
			if (isset($_GPC['code'])) {
				$userinfo = $this -> oauth2();
				if (!empty($userinfo)) {
					$openid = $userinfo["openid"];
					$nickname = $userinfo["nickname"];
					$headimgurl = $userinfo["headimgurl"];
				} else {
					message('授权失败!');
				}
			} else {
				if (!empty($this -> _appsecret)) {
					$this -> getCode($url);
				}
			}
		}

		/* 更新会员信息 */
		$this -> updatemember($openid, $uid);

		/* 基本设置 */
		$setting = pdo_fetch("SELECT * FROM " . tablename($this -> table_setting) . " WHERE uniacid =:uniacid LIMIT 1", array(':uniacid' => $uniacid));
		$listnum = 8;

		/* 用户基本设置 */
		$user_setting = $this -> getUsersettingbyopenid($_W['openid']);
		if (!$user_setting) {
			$data = array('uniacid' => $_W['uniacid'], 'openid' => $_W['openid'], 'chess_add_info' => 0, 'player_add_info' => 0, 'collect_update_info' => 1, 'follow_update_info' => 1, 'publish_read_info' => 1, 'publish_share_info' => 1, 'addtime' => time());
			pdo_insert($this -> table_user_setting, $data);
		}

		//粉丝信息
		$fans = pdo_fetch("SELECT follow FROM " . tablename('mc_mapping_fans') . " WHERE uniacid='{$uniacid}' AND openid='{$openid}'");

		/* 分享设置 */
		load() -> model('mc');

		//分享头像
		$sharelogo = $_W['attachurl'] . $setting['logo'];

		//分享用户id
		$shareuid = mc_openid2uid($openid);

		//分享描述（不变）
		$sharedesc = $setting['description'];

		//分享链接（默认）
		$shareurl = $_W['siteroot'] . 'app/' . $this -> createMobileUrl('index', array('uid' => $shareuid));

		//分享链接（棋手）
		$shareplayerurl = $_W['siteroot'] . 'app/' . $this -> createMobileUrl('player', array('uid' => $shareuid));
		
		

		include_once 'mobile/' . strtolower(substr($f_name, 8)) . '.php';

	}

	/* 微信登录处理片段 Start */
	public function oauth2() {
		global $_GPC, $_W;
		load() -> func('communication');
		$code = $_GPC['code'];
		$token = $this -> getAuthorizationCode($code);
		$openid = $token['openid'];
		$userinfo = $this -> getUserInfo($openid);
		if ($userinfo['subscribe'] == 0) {
			/* 未关注用户通过网页授权access_token */
			$userinfo = $this -> getUserInfo($openid, $token['access_token']);
		}
		if (empty($userinfo) || !is_array($userinfo) || empty($userinfo['openid']) || empty($userinfo['nickname'])) {
			echo '<h1>获取微信公众号授权失败[无法取得userinfo], 请稍后重试！ 公众平台返回原始数据为: <br />' . $userinfo['meta'] . '<h1>';
			exit ;
		}

		/* 检查粉丝和会员是否存在 */
		$this -> addfans($userinfo);

		$headimgurl = $userinfo['headimgurl'];
		$nickname = $userinfo['nickname'];
		/* 设置cookie信息 */
		setcookie($this -> _auth2_headimgurl, $headimgurl);
		setcookie($this -> _auth2_nickname, $nickname);
		setcookie($this -> _auth2_openid, $openid);

		return $userinfo;
	}

	public function getUserInfo($openid, $ACCESS_TOKEN = '') {
		if ($ACCESS_TOKEN == '') {
			load() -> classs('weixin.account');
			$accObj = WeixinAccount::create($_W['account']['acid']);
			$ACCESS_TOKEN = $accObj -> fetch_token();

			$url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token={$ACCESS_TOKEN}&openid={$openid}&lang=zh_CN";
		} else {
			$url = "https://api.weixin.qq.com/sns/userinfo?access_token={$ACCESS_TOKEN}&openid={$openid}&lang=zh_CN";
		}
		$json = ihttp_get($url);
		$userInfo = @json_decode($json['content'], true);
		return $userInfo;
	}

	public function getAuthorizationCode($code) {
		$oauth2_code = "https://api.weixin.qq.com/sns/oauth2/access_token?appid={$this->_appid}&secret={$this->_appsecret}&code={$code}&grant_type=authorization_code";
		$content = ihttp_get($oauth2_code);
		$token = @json_decode($content['content'], true);
		if (empty($token) || !is_array($token) || empty($token['access_token']) || empty($token['openid'])) {
			echo '<h1>获取微信公众号授权' . $code . '失败[无法取得token以及openid], 请稍后重试！ 公众平台返回原始数据为: <br />' . $content['meta'] . '<h1>';
			exit ;
		}
		return $token;
	}

	public function getCode($url) {
		global $_W;
		$url = urlencode($url);
		$oauth2_code = "https://open.weixin.qq.com/connect/oauth2/authorize?appid={$this->_appid}&redirect_uri={$url}&response_type=code&scope=snsapi_userinfo&state=0#wechat_redirect";
		header("location:$oauth2_code");
	}

	public function addfans($userinfo) {
		ignore_user_abort();
		set_time_limit(180);

		global $_W;

		load() -> model('mc');
		$setting = uni_setting($_W['uniacid'], array('passport'));
		$fans = mc_fansinfo($userinfo['openid']);
		if (empty($fans)) {
			$default_group = pdo_fetchcolumn('SELECT groupid FROM ' . tablename('mc_groups') . ' WHERE uniacid = :uniacid AND isdefault = 1', array(':uniacid' => $_W['uniacid']));

			$rec = array();
			$rec['acid'] = $_W['acid'];
			$rec['uniacid'] = $_W['uniacid'];
			$rec['uid'] = 0;
			$rec['openid'] = $userinfo['openid'];
			$rec['nickname'] = $userinfo['nickname'];
			$rec['salt'] = random(8);
			$rec['follow'] = $userinfo['subscribe'] ? $userinfo['subscribe'] : 0;
			$rec['followtime'] = $userinfo['subscribe_time'] ? $userinfo['subscribe_time'] : 0;
			$rec['unfollowtime'] = 0;
			$rec['updatetime'] = TIMESTAMP;
			if (!isset($setting['passport']) || empty($setting['passport']['focusreg'])) {
				$data = array('uniacid' => $_W['uniacid'], 'email' => md5($userinfo['openid']) . '@we7.cc', 'salt' => random(8), 'groupid' => $default_group['id'], 'nickname' => $userinfo['nickname'], 'avatar' => substr($userinfo['headimgurl'], 0, -1) . "132", 'gender' => $userinfo['sex'], 'createtime' => TIMESTAMP, );
				$data['password'] = md5($userinfo['openid'] . $data['salt'] . $_W['config']['setting']['authkey']);
				pdo_insert('mc_members', $data);
				$rec['uid'] = pdo_insertid();
			}
			pdo_insert('mc_mapping_fans', $rec);
		}
	}

	/* 微信登录处理片段 End */

	/* 更新系统用户信息 */
	public function updatemember($openid, $uid) {
		ignore_user_abort();
		set_time_limit(180);

		global $_W, $_GPC;
		load() -> model('mc');
		$fansinfo = mc_fansinfo($openid);
		$setting = pdo_fetch("SELECT * FROM " . tablename($this -> table_setting) . " WHERE uniacid =:uniacid LIMIT 1", array(':uniacid' => $_W['uniacid']));

		/* 检查用户是否存在 */
		$lessonmember = pdo_fetch("SELECT addtime,updatetime,status FROM " . tablename($this -> table_user) . " WHERE uniacid='{$_W['uniacid']}' AND openid='{$openid}'");
		if (empty($lessonmember) && !empty($openid) && $fansinfo['uid'] > 0) {
			//如果用户不存在
			$insertarr = array('uniacid' => $_W['uniacid'], 'uid' => $fansinfo['uid'], 'openid' => $openid, 'nickname' => $fansinfo['nickname'], 'parentid' => $uid, 'updatetime' => 0, 'addtime' => time(), );
			pdo_insert($this -> table_user, $insertarr);
			$id = pdo_insertid();

		}else if(isset($lessonmember['status']) && $lessonmember['status']==0){
			message("对不起，由于您没有遵守象棋微学堂软件使用规范，被拉入了黑名单，如需取消，请联系管理员微信号：3797985");
		}

	}

	//php获取中文字符拼音首字母
	public function getFirstCharter($str) {
		if (empty($str)) {
			return '';
		}
		$fchar = ord($str{0});
		if ($fchar >= ord('A') && $fchar <= ord('z'))
			return strtoupper($str{0});
		$s1 = iconv('UTF-8', 'gb2312', $str);
		$s2 = iconv('gb2312', 'UTF-8', $s1);
		$s = $s2 == $str ? $s1 : $str;
		$asc = ord($s{0}) * 256 + ord($s{1}) - 65536;
		if ($asc >= -20319 && $asc <= -20284)
			return 'A';
		if ($asc >= -20283 && $asc <= -19776)
			return 'B';
		if ($asc >= -19775 && $asc <= -19219)
			return 'C';
		if ($asc >= -19218 && $asc <= -18711)
			return 'D';
		if ($asc >= -18710 && $asc <= -18527)
			return 'E';
		if ($asc >= -18526 && $asc <= -18240)
			return 'F';
		if ($asc >= -18239 && $asc <= -17923)
			return 'G';
		if ($asc >= -17922 && $asc <= -17418)
			return 'H';
		if ($asc >= -17417 && $asc <= -16475)
			return 'J';
		if ($asc >= -16474 && $asc <= -16213)
			return 'K';
		if ($asc >= -16212 && $asc <= -15641)
			return 'L';
		if ($asc >= -15640 && $asc <= -15166)
			return 'M';
		if ($asc >= -15165 && $asc <= -14923)
			return 'N';
		if ($asc >= -14922 && $asc <= -14915)
			return 'O';
		if ($asc >= -14914 && $asc <= -14631)
			return 'P';
		if ($asc >= -14630 && $asc <= -14150)
			return 'Q';
		if ($asc >= -14149 && $asc <= -14091)
			return 'R';
		if ($asc >= -14090 && $asc <= -13319)
			return 'S';
		if ($asc >= -13318 && $asc <= -12839)
			return 'T';
		if ($asc >= -12838 && $asc <= -12557)
			return 'W';
		if ($asc >= -12556 && $asc <= -11848)
			return 'X';
		if ($asc >= -11847 && $asc <= -11056)
			return 'Y';
		if ($asc >= -11055 && $asc <= -10247)
			return 'Z';
		return null;
	}

	/* 根据categoryid获取ico */
	public function getCategoryicoById($uniacid, $id) {
		$category = pdo_get($this -> table_category, array('id' => $id, 'uniacid' => $uniacid), array('ico'));
		return $category['ico'];

	}

	/* 根据categoryid获取名称 */
	public function getCategoryiconameById($uniacid, $id) {
		$category = pdo_get($this -> table_category, array('id' => $id, 'uniacid' => $uniacid), array('name'));
		return $category['name'];

	}

	/* timeago */
	public function timeago($ptime) {
		$etime = time() - $ptime;
		if ($etime < 59)
			return '刚刚';
		$interval = array(12 * 30 * 24 * 60 * 60 => '年前 (' . date('Y-m-d', $ptime) . ')', 30 * 24 * 60 * 60 => '个月前 (' . date('Y-m-d', $ptime) . ')', 7 * 24 * 60 * 60 => '周前 (' . date('m-d', $ptime) . ')', 24 * 60 * 60 => '天前', 60 * 60 => '小时前', 60 => '分钟前', 1 => '秒前');
		foreach ($interval as $secs => $str) {
			$d = $etime / $secs;
			if ($d >= 1) {
				$r = round($d);
				return $r . $str;
			}
		}
	}

	/* 根据数据得到棋谱HTML */
	public function data2chesshtml($data) {
		global $_W;
		$html = '';
		foreach ($data as $k => $v) {
			$html .= '<li class="mui-table-view-cell mui-media manage" chessid="' . $v['id'] . '">';
			$html .= '<a href="' . $this -> createMobileUrl('chess', array('file' => $v['filename'])) . '">';
			$html .= '<img class="mui-media-object mui-pull-left" src="' . $_W['attachurl'] . $this -> getCategoryicoById($v['uniacid'], $v['categoryid']) . '">';
			$html .= '<div class="mui-media-body mui-ellipsis">';
			$html .= '<span class="mui-badge mui-badge-primary" style="border-radius:2px;font-size:.8em;padding:3px 3px;';
			if (!$v['iszhiding']) {
				$html .= 'display:none;';
			}
			$html .= '">顶</span>';
			$html .= '<span class="mui-badge mui-badge-success" style="border-radius:2px;font-size:.8em;padding:3px 3px;';
			if (!$v['isjinghua']) {
				$html .= 'display:none;';
			}
			$html .= '">精</span>';
			$html .= '<span class="mui-badge mui-badge-warning" style="border-radius:2px;font-size:.8em;padding:3px 3px;';
			if (!$v['ishot']) {
				$html .= 'display:none;';
			}
			$html .= '">火</span>';
			$html .= '<span>' . $v['title'] . '</span>';
			$html .= '<ul class="weui-media-box__info" style="padding:5px 0px 0px 0px; margin:5px 5px 5px  0">';

			$html .= '<li class="weui-media-box__info__meta" style="padding-left:5px;padding-right:5px">' . $v['redname'] . ' VS ' . $v['blackname'] . '</li>';
			$html .= '<li class="weui-media-box__info__meta  weui-media-box__info__meta_extra"><span style="display:block;text-align:right">' . $this -> timeago($v['addtime']) . '</span></li>';
			$html .= '</ul>';
			$html .= '</div>';
			$html .= '</a>';
			$html .= '</li>';
		}
		return $html;
	}

	/* 根据数据得到自己发布的棋谱HTML */
	public function data2publishchesshtml($data) {
		global $_W;
		$html = '';
		foreach ($data as $k => $v) {
			$html .= '<li class="mui-table-view-cell mui-media">';
			$html .= '<div class="mui-slider-right mui-disabled">';
			if ($v['status'] != '1') {
				$html .= '<a class="mui-btn mui-btn-primary mui-icon mui-icon-paperplane" chessid="' . $v['id'] . '" href="' . $this -> createMobileUrl('publish', array('displaytype' => 'release', 'chessid' => $v['id'])) . '"></a>';
			}
			$html .= '<a class="mui-btn mui-btn-yellow mui-icon mui-icon-compose" chessid="' . $v['id'] . '" href="' . $this -> createMobileUrl('publish', array('displaytype' => 'edit', 'chessid' => $v['id'])) . '"></a>';

			$html .= '<a class="mui-btn mui-btn-grey mui-icon mui-icon-trash" chessid="' . $v['id'] . '"></a>';
			$html .= '</div>';
			$html .= '<div class="mui-slider-handle">';
			$html .= '<a href="' . $this -> createMobileUrl('chess', array('file' => $v['filename'])) . '">';
			$html .= '<img class="mui-media-object mui-pull-left" src="' . $_W['attachurl'] . $this -> getCategoryicoById($v['uniacid'], $v['categoryid']) . '">';
			$html .= '<div class="mui-media-body mui-ellipsis">';
			if ($v['status'] == '1') {
				$html .= '<span class="mui-icon mui-icon-paperplane"></span>';
			}
			if ($v['iszhiding']) {
				$html .= '<span class="mui-badge mui-badge-primary" style="border-radius:2px;font-size:.8em;padding:3px 3px;">顶</span>';
			}
			if ($v['isjinghua']) {
				$html .= '<span class="mui-badge mui-badge-success" style="border-radius:2px;font-size:.8em;padding:3px 3px;">精</span>';
			}
			if ($v['ishot']) {
				$html .= '<span class="mui-badge mui-badge-warning" style="border-radius:2px;font-size:.8em;padding:3px 3px;">火</span>';
			}

			$html .= '<span style="color:#000">' . $v['title'] . '</span>';
			$html .= '<ul class="weui-media-box__info" style="padding:5px 0px 0px 0px; margin:5px 5px 5px  0">';

			$html .= '<li class="weui-media-box__info__meta">' . $v['redname'] . ' VS ' . $v['blackname'] . '</li>';
			$html .= '<li class="weui-media-box__info__meta  weui-media-box__info__meta_extra"><span style="display:block;text-align:right">' . $this -> timeago($v['addtime']) . '</span></li>';
			$html .= '</ul>';
			$html .= '</div>';
			$html .= '</a>';
			$html .= '</div>';
			$html .= '</li>';
		}
		return $html;
	}

	/* 根据数据得到自己收藏的棋谱HTML */
	public function data2collectchesshtml($data) {
		global $_W;
		$html = '';
		foreach ($data as $k => $v) {
			$html .= '<li class="mui-table-view-cell mui-media">';
			$html .= '<div class="mui-slider-right mui-disabled">';

			$html .= '<a class="mui-btn mui-btn-grey mui-icon mui-icon-trash" chessid="' . $v['id'] . '"></a>';
			$html .= '</div>';
			$html .= '<div class="mui-slider-handle">';
			$html .= '<a href="' . $this -> createMobileUrl('chess', array('file' => $v['filename'])) . '">';
			$html .= '<img class="mui-media-object mui-pull-left" src="' . $_W['attachurl'] . $this -> getCategoryicoById($v['uniacid'], $v['categoryid']) . '">';
			$html .= '<div class="mui-media-body mui-ellipsis">';
			if ($v['iszhiding']) {
				$html .= '<span class="mui-badge mui-badge-primary" style="border-radius:2px;font-size:.8em;padding:3px 3px;">顶</span>';
			}
			if ($v['isjinghua']) {
				$html .= '<span class="mui-badge mui-badge-success" style="border-radius:2px;font-size:.8em;padding:3px 3px;">精</span>';
			}
			if ($v['ishot']) {
				$html .= '<span class="mui-badge mui-badge-warning" style="border-radius:2px;font-size:.8em;padding:3px 3px;">火</span>';
			}

			$html .= '<span style="color:#000">' . $v['title'] . '</span>';
			$html .= '<ul class="weui-media-box__info" style="padding:5px 0px 0px 0px; margin:5px 5px 5px  0">';

			$html .= '<li class="weui-media-box__info__meta">' . $v['redname'] . ' VS ' . $v['blackname'] . '</li>';
			$html .= '<li class="weui-media-box__info__meta  weui-media-box__info__meta_extra"><span style="display:block;text-align:right">' . $this -> timeago($v['addtime']) . '</span></li>';
			$html .= '</ul>';
			$html .= '</div>';
			$html .= '</a>';
			$html .= '</div>';
			$html .= '</li>';
		}
		return $html;
	}

	/* 根据数据得到棋手HTML */
	public function data2playerhtml($data, $openid) {
		global $_W;
		$html = '';
		foreach ($data as $k => $v) {
			$html .= '<li class="mui-table-view-cell">';
			$html .= '<div class="mui-slider-cell">';
			$html .= '<div class="oa-contact-cell mui-table">';
			$html .= '<div class="oa-contact-avatar mui-table-cell">';
			$html .= '<a  href="' . $this -> createMobileUrl('center', array('op' => 'display', 'playerid' => $v['id'])) . '">';
			if ($v['photo']) {
				$html .= '<img src="' . (tomedia($v['photo'])) . '" height="60px" width="60px">';
			} else {
				$html .= '<img src="' . MODULE_URL . 'template/mobile/images/touxiang.jpg" height="60px" width="60px">';
			}
			$html .= '</a>';
			$html .= '</div>';
			$html .= '<div class="oa-contact-content mui-table-cell">';
			$html .= '<div class="mui-clearfix">';
			$html .= '<h4 class="oa-contact-name">' . $v['playername'] . '</h4>';
			$html .= '<span class="oa-contact-position mui-h6" style="float:left; line-height:2em">' . $v['playerlevel'] . '</span>';
			$html .= '<div style="float:right; background-color:#efeff4">';
			if ($this -> isfollowed($openid, $v['id']) == '1') {
				$html .= '<button type="button" class="mui-btn mui-btn-outlined" playerid=' . $v['id'] . ' data-loading-icon="" style="color:#ccc">已关注</button>';
			} elseif ($this -> isfollowed($openid, $v['id']) == '2') {
				$html .= '<button type="button" class="mui-btn mui-btn" playerid=' . $v['id'] . ' data-loading-icon="" style="color:#000">关注</button>';
			}

			$html .= '</div>';
			$html .= '</div>';
			$html .= '<ul class="weui-media-box__info" style="padding:5px 0px 0px 0px; margin:0">';
			$html .= '<li class="weui-media-box__info__meta">棋谱：' . $v['chesssum'] . '</li>';
			$html .= '<li class="weui-media-box__info__meta weui-media-box__info__meta_extra">粉丝：' . $v['followsum'] . '</li>';
			$html .= '</ul>';
			$html .= '</div>';
			$html .= '</div>';
			$html .= '</div>';
			$html .= '</li>';
		}
		return $html;
	}

	/**
	 * [data2commentshtml 数据转评论html]
	 * @param  [type] $data [数据]
	 * @return [type]       [评论html]
	 * @author [type]       [cfy]
	 */
	private function data2commentshtml($data) {
		global $_W;
		$setting = pdo_fetch("SELECT * FROM " . tablename($this -> table_setting) . " WHERE uniacid =:uniacid LIMIT 1", array(':uniacid' => $_W['uniacid']));
		$html = '';
		foreach ($data as $k => $comment) {
			$html .= '<li class="mui-table-view-cell mui-media" style="background-color: #f8f8f8">';
			$html .= '<img class="mui-media-object mui-pull-left" src="';
			$html .= tomedia($comment['avatar']) . '" style="height: 32px;width: 32px;border-radius: 100%;"';
			$html .= '</a><div class="mui-media-body mui-ellipsis"><span style="color:#1E5DD6;opacity: 0.7;">' . $comment['name'] . '</span> <span style="position:absolute;top:-3px;right:15px;display:none;color:red;">+1</span><span style="position:absolute;top:-3px;right:15px;display:none;color:red;">-1</span>';
			$html .= '<span class="mui-icon-extra mui-icon-extra-like mui-pull-right" level="' . bcadd($comment['level'], 1) . '" id="prize_' . $comment['id'] . '" style="font-size: 1em;';
			if ($this -> isprized($_W['openid'], $comment['id'], bcadd($comment['level'], 1)) == 1) {
				$html .= 'color:red;" >';
			} else {
				$html .= 'color:#999999;" > ';
			}
			$html .= ' ' . $comment['prizesum'];
			$html .= '</span></div><div class="mui-media-body mui-ellipsis-2" style = "padding-top:5px;font-size: 16px;line-height: 23px;">';
			$html .= $comment['commenttext'] . '</div><div class="mui-media-body mui-ellipsis"><ul class="weui-media-box__info" style="padding:5px 0px 0px 0px; margin:5px 5px 5px  0"><li class="weui-media-box__info__meta see" style="display: none;color:#1E5DD6;opacity: 0.4;padding-left:42px;">全文</li><li class="weui-media-box__info__meta" style="padding-left:42px;">';
			$html .= date('m-d H:i', $comment['commentdate']) . '</li><li class="weui-media-box__info__meta weui-media-box__info__meta_extra" >';

			if ($this -> iscommented($_W['openid'], $comment['id'], $comment['level']) == 1) {
				$html .= '<a href="javascript:;" class="open-popup" id="delete_' . $comment['id'] . '" style="background-color:transparent!important;color:#999999" level ="' . $comment['level'] . '" >删除&nbsp&nbsp</a>';
				$html .= '</a>';
			}
			$html .= '<a href="javascript:;" style="background-color:transparent!important;color:#999999"  class="open-popup" id="comment_' . $comment['id'] . '" followsum="comment_' . $comment['comment'] . '" name="comment_' . $comment['name'] . '" level="comment_' . $comment['level'] . '" >';
			$html .= $comment['comment'] . '回复> ';
			$html .= '</a></li></ul></div></a></li>';

		}
		return $html;
	}

	/**
	 * [isprized 判断是否赞过]
	 * @param  [type] $openid [用户id]
	 * @param  [type] $id     [棋谱id或者用户commentid]
	 * @param  [type] $type   [0棋谱id，1为commentid，2为子评论id]
	 * @return [type]         [0没赞，1赞]
	 * @author [type]         [cfy]
	 */
	private function isprized($openid, $id, $level = 0) {
		global $_W;
		if ($level == 0) {
			$prize = pdo_get($this -> table_prize, array('uniacid' => $_W['uniacid'], 'openid' => $openid, 'chessid' => $id, 'type' => 0));
		}
		if ($level != 0) {
			$prize = pdo_get($this -> table_prize_user, array('uniacid' => $_W['uniacid'], 'openid' => $openid, 'commentid' => $id, 'level' => $level));
		}
		if (empty($prize)) {
			return 0;
		} else {
			return 1;
		}
	}

	/**
	 * [istread 判断是否踩过]
	 * @param  [type] $openid [用户id]
	 * @param  [type] $id     [棋谱id]
	 * @return [type]         [0没踩，1踩过]
	 * @author [type]         [cfy]
	 */
	private function istread($openid, $id) {
		global $_W;
		$prize = pdo_get($this -> table_prize, array('uniacid' => $_W['uniacid'], 'openid' => $openid, 'chessid' => $id, 'type' => 1));

		if (empty($prize)) {
			return 0;
		} else {
			return 1;
		}
	}

	/**
	 * [iscommented 判断是否评论过]
	 * @param  [type] $openid [用户id]
	 * @param  [type] $id     [棋谱id或者用户commentid]
	 * @param  [type] $type   [0棋谱id，1为commentid，2为子评论id]
	 * @return [type]         [0没赞，1赞]
	 * @author [type]         [cfy]
	 */
	private function iscommented($openid, $id, $level = 0) {
		global $_W;

		if ($level == 0) {
			$comment = pdo_get($this -> table_comments, array('uniacid' => $_W['uniacid'], 'openid' => $openid, 'id' => $id));
		}
		if ($level != 0) {
			$comment = pdo_get($this -> table_comments_user, array('uniacid' => $_W['uniacid'], 'openid' => $openid, 'id' => $id));
		}
		if (empty($comment)) {
			return 0;
		} else {
			return 1;
		}
	}

	/**
	 * [ismanage 判断是否是前台管理员]
	 * @param  [type] $openid [openid]
	 * @return [type]         [1是0不是]
	 * @author                 cfy
	 */
	private function ismanage($openid) {
		global $_W;
		global $_GPC;
		$setting = pdo_get($this -> table_setting, array('uniacid' => $_W['uniacid']));
		$manage = json_decode($setting['manage']);
		if (in_array($openid, $manage)) {
			return '1';
		} else {
			return '0';
		}
	}

	/* 判断是否被关注 */
	public function isfollowed($openid, $id) {
		global $_W;
		global $_GPC;
		$collect = pdo_get($this -> table_follow, array('uniacid' => $_W['uniacid'], 'openid' => $openid, 'playerid' => $id));

		if (empty($collect)) {
			return '2';
		} else {
			return '1';
		}
	}

	/* 判断是否被收藏 */
	public function iscollected($file, $openid) {
		global $_W;
		$condition['uniacid'] = $_W['uniacid'];
		$condition['filename'] = $file;
		$condition['openid'] = $openid;
		$result = pdo_get($this -> table_collect, $condition);
		if (!empty($result)) {
			return '1';
		} else {
			return '-1';
		}
	}

	/* 判断当前棋谱是否已经发布 */
	public function ispublished($file, $openid) {
		global $_W;
		$condition['uniacid'] = $_W['uniacid'];
		$condition['filename'] = $file;
		$list = pdo_get($this -> table_chess, $condition);

		if (!empty($list)) {
			if ($list['openid'] == $openid && $list['status'] == 2) {
				return '1';
			}

		} else {
			return '-1';
		}
	}

	/* 获得棋手信息 */
	public function playerid2info($playerid) {
		global $_W;
		$condition['uniacid'] = $_W['uniacid'];
		$condition['id'] = $playerid;
		$list = pdo_get($this -> table_player, $condition, array('photo', 'playername'));
		return $list;
	}

	/* 棋手关注数量增减 */
	public function edit_follow_sum($playerid, $type) {
		global $_W;
		$condition['uniacid'] = $_W['uniacid'];
		$condition['id'] = $playerid;
		$result = pdo_get($this -> table_player, $condition);
		$sum = $result['followsum'];
		switch($type) {
			case 'add' :
				{
					$sum += 1;
				}
				break;
			case 'minus' :
				{
					$sum -= 1;
				}
				break;
			default : {

			}
		};
		$data['followsum'] = $sum;
		$update = pdo_update($this -> table_player, $data, $condition);
		if (!empty($update)) {
			return $sum;
		} else {
			return -1;
		}
	}

	/* 棋手棋谱数量增减 */
	public function edit_chess_sum($playerid, $type) {
		global $_W;
		$condition['uniacid'] = $_W['uniacid'];
		$condition['id'] = $playerid;
		$result = pdo_get($this -> table_player, $condition);
		$sum = $result['chesssum'];
		switch($type) {
			case 'add' :
				{
					$sum += 1;
				}
				break;
			case 'minus' :
				{
					$sum -= 1;
				}
				break;
			default : {

			}
		};
		$data['chesssum'] = $sum;
		$update = pdo_update($this -> table_player, $data, $condition);
		if (!empty($update)) {
			return $sum;
		} else {
			return -1;
		}
	}

	/* 判断是否棋手 */
	//cfy修改判断是否审核
	private function isplayer($openid) {
		global $_W;
		$condition['uniacid'] = $_W['uniacid'];
		$condition['openid'] = $openid;
		$list = pdo_get($this -> table_player, $condition);
		if (empty($list)) {
			//不是棋手返回0
			return 0;
		} else {
			if ($list['status'] == 2) {
				//是待审核的棋手返回2
				return 2;
			}
			if ($list['status'] == -1) {
				//审核未通过的棋手返回-1
				return -1;
			}
			if ($list['status'] == 1) {
				//审核通过的棋手返回1
				return 1;
			}

		}
	}

	/**
	 * [isvip 判断是否是vip]
	 * @param  [type] $uid [用户id]
	 * @return [type]      [1是vip，0不是，2曾经是但已到期]
	 * @author [cfy] <[<email address>]>
	 */
	private function isvip($uid) {
		global $_W;
		$condition['uniacid'] = $_W['uniacid'];
		$condition['uid'] = $uid;
		$memberInfo = pdo_get($this -> table_user, $condition);
		if ($memberInfo['vip'] == 1 && time() < $memberInfo['vip_validity']) {
			//是vip
			return 1;
		} elseif ($memberInfo['vip'] == 1 && time() > $memberInfo['vip_validity']) {
			//曾是vip，但已到期
			return 2;
		} elseif ($memberInfo['vip'] == 0) {
			//不是vip
			return 0;
		}
	}

	//根据棋手名字获得头像和关注数
	//by cfy
	private function playertoImageFollow($playername) {
		global $_W;
		$condition['uniacid'] = $_W['uniacid'];
		$condition['playername'] = $playername;
		//$condition['status'] = 1; // 只显示审核通过的
		$list = pdo_get($this -> table_player, $condition);
		if (empty($list)) {
			// 如果为空，则先返回空。
			/* $playerinfo = $this->getUserInfo($list['openid']);
			 $player['image'] = $playerinfo["headimgurl"]; */
			$player['image'] = '';
			$player['followsum'] = 0;

		} else {
			$player['image'] = tomedia($list['photo']);
			$player['followsum'] = $list['followsum'];
		}
		return $player;
	}

	/* 获取棋手棋谱数目 */
	public function get_player_chessnsum($playerid) {
		global $_W;
		$condition = " uniacid='{$uniacid}' ";
		if (!empty($playerid)) {
			$condition .= " AND ( redplayerid = {$playerid} or blackplayerid = {$playerid} )";
		}
		$sum = pdo_fetchcolumn("SELECT COUNT(*) FROM " . $this -> table_chess . " where " . $condition);
		return $sum;
	}

	/* 增加积分 */
	public function addcoin($coin) {
		global $_W;
		load() -> model('mc');
		mc_credit_update($_W['member']['uid'], 'credit1', $coin, array($_W['member']['uid'], '上传棋谱奖励积分：' . $coin));
	}

	/**
	 * [template_player_follow 棋手被关注模板通知]
	 * @param  [type] $openid [棋手id]
	 * @return [type]         [description]
	 */
	private function template_player_follow($openid) {

	}

	/**
	 * [template_chess_collect_player_follow 棋谱被收藏,棋手被关注模板通知]
	 * @param  [type] $openid [棋谱作者id]
	 * @param [type] $type        [模板类型,0棋谱被收藏，1棋谱被转发,2为棋谱被关注,3发布棋谱,]
	 * @author [type]           [cfy]
	 */
	private function template_chess_collect_player_follow($openid, $message, $type = 0) {
		global $_W, $_GPC;
		$uniacid = $_W['uniacid'];
		$setting = pdo_fetch("SELECT * FROM " . tablename($this -> table_setting) . " WHERE uniacid =:uniacid LIMIT 1", array(':uniacid' => $uniacid));
		$user_setting = $this -> getUsersettingbyopenid($openid);
		$uid = mc_openid2uid($openid);
		$memberinfo = pdo_fetch("SELECT uid,credit1,credit2,nickname,avatar FROM " . tablename('mc_members') . " WHERE uniacid='{$uniacid}' AND uid='{$uid}' LIMIT 1");

		if ($setting['istemplate'] === '1') {

			switch ($type) {
				case 0 :
					if ($user_setting['collect_update_info'] === '1') {
						if (!($openid == $_W['openid'])) {
							$sendmessage = array('touser' => $openid, 'template_id' => $setting['collect_update_info'], 'url' =>$message['url'], 'topcolor' => "#7B68EE",
							//data待修改，改成与模板类型一样的。
							'data' => array('first' => array('value' => "亲爱的{$memberinfo['nickname']},您的积分账户有新的变动，具体内容如下：", 'color' => "#1E5DD6", ), 'keyword1' => array('value' => date('Y-m-d H:i', time()), 'color' => "#1E5DD6", ), 'keyword2' => array('value' => $message['value'], 'color' => "#1E5DD6", ), 'keyword3' => array('value' => $message['reason'], 'color' => "#1E5DD6", ), 'keyword4' => array('value' => ceil($memberinfo['credit1']), 'color' => "#1E5DD6", ), 'remark' => array('value' => '感谢您对象棋微学堂的鼎力支持，用积分去兑换更高棋力吧！', 'color' => "#1E5DD6", )));
							$this -> send_template_message(urldecode(json_encode($sendmessage)));
						}

					}
					break;
				case 1 :
					if ($user_setting['publish_share_info'] === '1') {
						$sendmessage = array('touser' => $openid, 'template_id' => $setting['publish_share_info'], 'url' => $message['url'], 'topcolor' => "#7B68EE",
						//data待修改，改成与模板类型一样的。
						'data' => array('first' => array('value' => "亲爱的{$memberinfo['nickname']},您的积分账户有新的变动，具体内容如下：", 'color' => "#1E5DD6", ), 'keyword1' => array('value' => date('Y-m-d H:i', time()), 'color' => "#1E5DD6", ), 'keyword2' => array('value' => $message['value'], 'color' => "#1E5DD6", ), 'keyword3' => array('value' => $message['reason'], 'color' => "#1E5DD6", ), 'keyword4' => array('value' => ceil($memberinfo['credit1']), 'color' => "#1E5DD6", ), 'remark' => array('value' => '感谢您对象棋微学堂的鼎力支持，用积分去兑换更高棋力吧！', 'color' => "#1E5DD6", )));
						$this -> send_template_message(urldecode(json_encode($sendmessage)));
					}
					break;
				case 2 :
					$sendmessage = array('touser' => $openid, 'template_id' => $setting['collect_update_info'], 'url' => $message['url'], 'topcolor' => "#7B68EE",
					//data待修改，改成与模板类型一样的。
					'data' => array('first' => array('value' => "亲爱的{$memberinfo['nickname']},您的积分账户有新的变动，具体内容如下：", 'color' => "#1E5DD6", ), 'keyword1' => array('value' => date('Y-m-d H:i', time()), 'color' => "#1E5DD6", ), 'keyword2' => array('value' => $message['value'], 'color' => "#1E5DD6", ), 'keyword3' => array('value' => $message['reason'], 'color' => "#1E5DD6", ), 'keyword4' => array('value' => ceil($memberinfo['credit1']), 'color' => "#1E5DD6", ), 'remark' => array('value' => '感谢您对象棋微学堂的鼎力支持，用积分去兑换更高棋力吧！', 'color' => "#1E5DD6", )));
					$this -> send_template_message(urldecode(json_encode($sendmessage)));
					break;
				case 3 :
					$sendmessage = array('touser' => $openid, 'template_id' => $setting['collect_update_info'], 'url' => $message['url'], 'topcolor' => "#7B68EE",
					//data待修改，改成与模板类型一样的。
					'data' => array('first' => array('value' => "亲爱的{$memberinfo['nickname']},您的积分账户有新的变动，具体内容如下：", 'color' => "#1E5DD6", ), 'keyword1' => array('value' => date('Y-m-d H:i', time()), 'color' => "#1E5DD6", ), 'keyword2' => array('value' => $message['value'], 'color' => "#1E5DD6", ), 'keyword3' => array('value' => $message['reason'], 'color' => "#1E5DD6", ), 'keyword4' => array('value' => ceil($memberinfo['credit1']), 'color' => "#1E5DD6", ), 'remark' => array('value' => '感谢您对象棋微学堂的鼎力支持，用积分去兑换更高棋力吧！', 'color' => "#1E5DD6", )));
					$this -> send_template_message(urldecode(json_encode($sendmessage)));
					break;
			}
		}
	}

	/**
	 * [template_chess_addbyplayer 棋手新增棋谱模板通知和新增棋谱通知]
	 * @param  [type] $playerid [棋手id]
	 * @param  [type] $filename [棋谱]
	 * @return [type] $type		[0棋手新增棋谱,1公众号新增棋谱]
	 * @author [type]           [cfy]
	 */
	private function template_chess_addbyplayer($filename, $type = 0, $playerid = '') {
		global $_W, $_GPC;
		$uniacid = $_W['uniacid'];
		//$user_setting = $this->getUsersettingbyopenid($openid);
		$setting = pdo_fetch("SELECT * FROM " . tablename($this -> table_setting) . " WHERE uniacid =:uniacid LIMIT 1", array(':uniacid' => $uniacid));
		if ($setting['istemplate'] === '1') {
			$chess = pdo_fetch("SELECT * FROM " . tablename($this -> table_chess) . " WHERE uniacid='{$uniacid}' AND filename='{$filename}' ");
			switch ($type) {
				case 0 :
					$follow = pdo_fetchall("SELECT openid FROM " . tablename($this -> table_follow) . " WHERE uniacid='{$uniacid}' AND playerid={$playerid}");
					$player = pdo_fetch("SELECT * FROM " . tablename($this -> table_player) . " WHERE uniacid='{$uniacid}' AND id={$playerid}");
					if (empty($follow)) {
						return error(-1, '该棋手没有粉丝');
					}
					foreach ($follow as $key => $value) {
						$user_setting = $this -> getUsersettingbyopenid($value['openid']);
						$uid = mc_openid2uid($value['openid']);
						$memberinfo = pdo_fetch("SELECT uid,credit1,credit2,nickname,avatar FROM " . tablename('mc_members') . " WHERE uniacid='{$uniacid}' AND uid='{$uid}' LIMIT 1");
						if ($user_setting['player_add_info'] === '1') {
							$sendmessage = array('touser' => $value['openid'], 'template_id' => $setting['player_add_info'], 'url' => $_W['siteroot'] . 'app/' . $this -> createMobileUrl('chess', array('file' => $filename)), 'topcolor' => "#7B68EE",
							//data待修改，改成与模板类型一样的。
							'data' => array('first' => array('value' => "亲爱的{$memberinfo['nickname']},您关注的棋手{$player['playername']}发布了新的棋谱，快去看看吧!", 'color' => "#1E5DD6", ), 'keyword1' => array('value' => '棋手发布棋谱通知', 'color' => "#1E5DD6", ), 'keyword2' => array('value' => date('Y-m-d H:i', time()), 'color' => "#1E5DD6", ), 'keyword3' => array('value' => "{$chess['title']}", 'color' => "#1E5DD6", ), 'remark' => array('value' => '感谢您对象棋微学堂的鼎力支持，去看看该棋谱吧！', 'color' => "#1E5DD6", )));
							$this -> send_template_message(urldecode(json_encode($sendmessage)));
						}
					}
					break;
				case 1 :
					$user_setting_array = pdo_fetchall("SELECT openid,chess_add_info FROM " . tablename($this -> table_user_setting) . " WHERE uniacid='{$uniacid}' ");
					foreach ($user_setting_array as $key => $value) {
						if ($value['chess_add_info'] == '1') {
							$uid = mc_openid2uid($value['openid']);
							$memberinfo = pdo_fetch("SELECT uid,credit1,credit2,nickname,avatar FROM " . tablename('mc_members') . " WHERE uniacid='{$uniacid}' AND uid='{$uid}' LIMIT 1");
							$sendmessage = array('touser' => $value['openid'], 'template_id' => $setting['chess_add_info'], 'url' => $_W['siteroot'] . 'app/' . $this -> createMobileUrl('chess', array('file' => $filename)), 'topcolor' => "#7B68EE",
							//data待修改，改成与模板类型一样的。
							'data' => array('first' => array('value' => "亲爱的{$memberinfo['nickname']},象棋微学堂有新的棋谱发布，快去看看吧!", 'color' => "#1E5DD6", ), 'keyword1' => array('value' => '新增棋谱通知', 'color' => "#1E5DD6", ), 'keyword2' => array('value' => date('Y-m-d H:i', time()), 'color' => "#1E5DD6", ), 'keyword3' => array('value' => "{$chess['title']}", 'color' => "#1E5DD6", ), 'remark' => array('value' => '感谢您对象棋微学堂的鼎力支持，去看看该棋谱吧！', 'color' => "#1E5DD6", )));
							$this -> send_template_message(urldecode(json_encode($sendmessage)));
						}
					}
					break;
				default :
					# code...
					break;
			}
		}

	}

	/**
	 * [getUsersettingbyopenid 通过openid获得用户设置]
	 * @param  [type] $openid [description]
	 * @return [array]         [description]
	 */
	private function getUsersettingbyopenid($openid) {
		global $_W, $_GPC;
		$condition['uniacid'] = $_W['uniacid'];
		$condition['openid'] = $openid;
		$user_setting = pdo_get($this -> table_user_setting, $condition);
		if (!$user_setting) {
			return false;
		}
		return $user_setting;
	}

	/* 发送模版消息 */
	private function send_template_message($messageDatas, $acid = null) {
		global $_W, $_GPC;
		if (empty($acid)) {
			$acid = $_W['account']['acid'];
		}

		load() -> classs('weixin.account');
		$accObj = WeixinAccount::create($acid);
		$access_token = $accObj -> fetch_token();

		$urls = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" . $access_token;
		$ress = $this -> http_request($urls, $messageDatas);

		return json_decode($ress, true);
	}

	/* https请求（支持GET和POST） */
	private function http_request($url, $messageDatas = null) {
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
		if (!empty($messageDatas)) {
			curl_setopt($curl, CURLOPT_POST, 1);
			curl_setopt($curl, CURLOPT_POSTFIELDS, $messageDatas);
		}
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		$output = curl_exec($curl);
		curl_close($curl);
		return $output;
	}

	/**
	 * [mc_handsel 通过ip禁止刷分]
	 * @param  [type] $touid   [赠送积分id]
	 * @param  [type] $fromuid [刷分用户ip]
	 * @param  [type] $handsel [积分设置]
	 * @param  string $uniacid [公众号id]
	 * @return [type]          [写入数据表信息，更新分数]
	 * @author [type]          [cfy]
	 */
	private function mc_handsel_rewrite($touid, $fromuid, $handsel, $uniacid = '') {
		global $_W;
		$touid = intval($touid);
		$fromuid = intval($fromuid);
		if (empty($uniacid)) {
			$uniacid = $_W['uniacid'];
		}
		if (empty($handsel['module'])) {
			return error(-1, '没有填写模块名称');
		}
		if (empty($handsel['sign'])) {
			return error(-1, '没有填写赠送积分对象信息');
		}
		if (empty($handsel['action'])) {
			return error(-1, '没有填写赠送积分动作');
		}
		$credit_value = intval($handsel['credit_value']);

		$sql = 'SELECT id FROM ' . tablename('mc_handsel') . ' WHERE uniacid = :uniacid AND touid = :touid AND fromuid = :fromuid AND module = :module AND sign = :sign AND action = :action';
		$parm = array(':uniacid' => $uniacid, ':touid' => $touid, ':fromuid' => $fromuid, ':module' => $handsel['module'], ':sign' => $handsel['sign'], ':action' => $handsel['action']);
		$handsel_exists = pdo_fetch($sql, $parm);
		if ($handsel_exists) {
			return error(-1, '已经赠送过积分,每个用户只能赠送一次');
		}
		$data = array('uniacid' => $uniacid, 'touid' => $touid, 'fromuid' => $fromuid, 'module' => $handsel['module'], 'sign' => $handsel['sign'], 'action' => $handsel['action'], 'credit_value' => $credit_value, 'createtime' => TIMESTAMP);
		pdo_insert('mc_handsel', $data);
		$log = array($fromuid, $handsel['credit_log'], 'gongyy_wechess', '', '1');
		if (mc_credit_update($touid, 'credit1', $credit_value, $log)) {
			$member = pdo_fetch("SELECT credit1 FROM " . tablename('mc_members') . " WHERE uniacid='{$_W['uniacid']}' AND uid='{$touid}' LIMIT 1");
			$creditLog = array('acid' => $_W['acid'], 'uniacid' => $_W['uniacid'], 'orderid' => '', 'uid' => $touid, 'openid' => '', 'change_type' => 1, 'number' => $credit_value, 'after_total' => $member['credit1'], 'addtime' => time(), 'remark' => $handsel['credit_log'], 'log_type' => 3);
			pdo_insert($this -> table_credit_log, $creditLog);
		}
		return true;
	}

	/**
	 * 如果支付方式为第三方支付，则判断支付通知为异步通知
	 * 如果支付方式为余额支付，则不判断支付是否为异步通知
	 * 同时判断订单状态为未支付时才操作业务逻辑
	 * By cmh 2017-03-23
	 */
	public function payResult($params) {
		global $_W, $_GPC;
		load() -> model('mc');
		$orderid = $params['tid'];
		$credit1Order = pdo_fetch("SELECT * FROM " . tablename($this -> table_credit_order) . " WHERE id = :id", array(':id' => $orderid));

		if (!empty($credit1Order)) {
			if ((($params['result'] == 'success' && $params['from'] == 'notify') || $params['type'] == 'credit') && $credit1Order['status'] == 0) {
				//业务逻辑操作
				$data = array('status' => $params['result'] == 'success' ? 1 : 0);
				$data['payment_type'] = $params['type'];
				$data['payment_time'] = time();

				if (pdo_update($this -> table_credit_order, $data, array('id' => $orderid))) {
					$log = array('0' => '', '1' => '用户充值积分', '2' => 'gongyy_wechess', '3' => '', '4' => '', '5' => '1', );
					if (mc_credit_update($credit1Order['uid'], 'credit1', $credit1Order['credit_number'], $log)) {
						//查询会员积分数
						$member = mc_fetch($credit1Order['uid'], array('credit1'));
						//添加积分日志记录
						$creditLog = array('acid' => $_W['acid'], 'uniacid' => $_W['uniacid'], 'orderid' => $orderid, 'uid' => $credit1Order['uid'], 'openid' => $credit1Order['openid'], 'log_type' => 1, 'change_type' => 1, 'number' => $credit1Order['credit_number'], 'after_total' => $member['credit1'], 'addtime' => time(), );
						pdo_insert($this -> table_credit_log, $creditLog);
					}
				}
			}

			if ($params['from'] == 'return') {
				message("支付成功", $this -> createMobileUrl('credit'), 'success');
			}
		}
	}

	public function tpl_app_form_field_image($name, $value = '') {

		$thumb = empty($value) ? 'images/global/nopic.jpg' : $value;
		$thumb = tomedia($thumb);

		$html = <<<EOF
	<div class="mui-table-view-chevron">
		<div class="mui-image-uploader">
			<a href="javascript:;" class="mui-upload-btn mui-pull-right js-image-{$name}"></a>
			<div class="mui-image-preview js-image-preview mui-pull-right"></div>
		</div>
	</div>
	<script>
		util.image($('.js-image-{$name}'), function(url){
			$('.js-image-{$name}').parent().find('.js-image-preview').append('<input type="hidden" value="'+url.attachment+'" name="{$name}[]" /><img src="'+url.url+'" data-id="'+url.id+'" data-preview-src="" data-preview-group="__IMG_UPLOAD_{$name}" />');
		}, {
			crop : false,
			multiple : true,
			preview : '__IMG_UPLOAD_{$name}'
		});
	</script>
EOF;
		return $html;
	}

}
