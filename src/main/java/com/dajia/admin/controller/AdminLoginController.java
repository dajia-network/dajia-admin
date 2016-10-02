package com.dajia.admin.controller;

import com.dajia.domain.User;
import com.dajia.repository.UserRepo;
import com.dajia.service.SmsService;
import com.dajia.service.UserService;
import com.dajia.util.CommonUtils;
import com.dajia.util.UserUtils;
import com.dajia.vo.LoginUserVO;
import com.dajia.vo.ReturnVO;
import net.sf.ehcache.Cache;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

/**
 * Created by huhaonan on 2016/10/2.
 */

@RestController
public class AdminLoginController {

    @Autowired
    public UserService userService;

    @Autowired
    public UserRepo userRepo;

    @Autowired
    public SmsService smsService;

    @Autowired
    public EhCacheCacheManager ehcacheManager;

    private final static String Login_Type_Mobile = "mobile";
    private final static String Login_Type_UserPass = "userPass";

    private final static Logger logger = LoggerFactory.getLogger("AdminLog");


    @RequestMapping("/signinSms/{mobile}")
    public @ResponseBody ReturnVO signinSms(@PathVariable("mobile") String mobile) {
        String result = smsService.sendSigninMessage(mobile, true);
        ReturnVO rv = new ReturnVO();
        rv.result = result;
        return rv;
    }

    @RequestMapping("/admin/signupCheck/{mobile}")
    public @ResponseBody ReturnVO signupCheck(@PathVariable("mobile") String mobile) {
        String result = userService.checkMobile(mobile);
        ReturnVO rv = new ReturnVO();
        rv.result = result;
        return rv;
    }

    @RequestMapping(value = "/admin/login", method = RequestMethod.POST)
    public @ResponseBody LoginUserVO login(@RequestBody LoginUserVO loginUser, HttpServletRequest request, HttpServletResponse response) {

        if (null == loginUser || StringUtils.isEmpty(loginUser.loginType)) {
            return null;
        }
        
        fillUserInfo(loginUser, request);

        if (Login_Type_Mobile.equalsIgnoreCase(loginUser.loginType)) {
            return mobileLogin(loginUser, request);
        }

        if (Login_Type_UserPass.equalsIgnoreCase(loginUser.loginType)) {
            return userPassLogin(loginUser, request);
        }

        return null;
    }

    @RequestMapping(value = "/admin/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.getSession(true).removeAttribute(UserUtils.session_user);
        response.sendRedirect("/admin/index.html#/login");
    }

    /**
     * 填充一些扩展字段
     *
     * @param loginUser
     * @param request
     */
    private void fillUserInfo(LoginUserVO loginUser, HttpServletRequest request) {
        loginUser.loginIP = CommonUtils.getRequestIP(request);
        loginUser.loginDate = new Date();
    }

    /**
     * 使用手机号和验证码登录
     *
     * @param loginUser
     * @return
     */
    private LoginUserVO mobileLogin(LoginUserVO loginUser, HttpServletRequest request) {

        String type = "mobile";

        if (null == loginUser) {
            logger.error("{} login failed, loginUserVo is null", type);
            return null;
        }

        if (null != ehcacheManager.getCacheManager().getCache(CommonUtils.cache_name_signin_code)) {
            Cache cache = ehcacheManager.getCacheManager().getCache(CommonUtils.cache_name_signin_code);
            String signinCode = cache.get(loginUser.mobile).getObjectValue().toString();
            logger.info(signinCode);
            if (null == signinCode || !signinCode.equals(loginUser.signinCode)) {
                return null;
            }
            loginUser.loginIP = CommonUtils.getRequestIP(request);
            loginUser.loginDate = new Date();

            User user = userService.userLogin(loginUser.mobile, loginUser.password, request, true);
            loginUser = UserUtils.addLoginSession(loginUser, user, request);

            return loginUser;
        } else {
            logger.error("{} login fail, no sign for user {}", type, loginUser);
            return null;
        }
    }

    /**
     * 使用用户名密码登录
     *
     * @param loginUserVO
     * @return
     */
    private LoginUserVO userPassLogin(LoginUserVO loginUserVO, HttpServletRequest request) {
        User user = userService.userPassLogin(loginUserVO);
        if (null == user) {
            return null;
        }
        return UserUtils.addLoginSession(loginUserVO, user, request);
    }
}
