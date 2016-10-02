package com.dajia.admin.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.dajia.util.CommonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.dajia.service.UserService;
import com.dajia.util.UserUtils;
import com.dajia.vo.LoginUserVO;

public class AdminFilter implements Filter {

	Logger logger = LoggerFactory.getLogger("AdminLog");

	@Autowired
	private UserService userService;

	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException,
			ServletException {
		// logger.info("in AdminFilter...");
		HttpServletRequest request = (HttpServletRequest) req;
		HttpSession session = request.getSession(true);
		LoginUserVO loginUser = (LoginUserVO) session.getAttribute(UserUtils.session_user);

		HttpServletResponse response = (HttpServletResponse) res;
		String reqUrl = request.getRequestURI();
		if (!isStatic(reqUrl)) {
			if (null == loginUser || null == loginUser.userId || null == loginUser.isAdmin
					|| !loginUser.isAdmin.equals(CommonUtils.Y)) {

				if(!isSkipped(reqUrl))
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			}
		}
		chain.doFilter(req, res);
	}

	private boolean isStatic(String requestUrl) {
		return requestUrl.endsWith(".css") ||
				requestUrl.endsWith(".js") ||
				requestUrl.endsWith(".html") ||
				requestUrl.endsWith(".htm") ||
				requestUrl.endsWith(".jpg") ||
				requestUrl.endsWith(".png") ||
				requestUrl.endsWith(".ico") ||
				requestUrl.endsWith(".gif") ||
				requestUrl.endsWith(".xls") ||
				requestUrl.endsWith(".xlsx") ;
	}

	private boolean isSkipped(String requestUrl) {
		return requestUrl.contains("/admin/signupCheck") ||
				requestUrl.contains("/admin/signinSms") ||
				requestUrl.contains("/admin/login") ||
				requestUrl.contains("/admin/logout") ;
	}

	public void destroy() {
	}

	public void init(FilterConfig arg0) throws ServletException {
	}

}
