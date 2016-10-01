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
		if (!reqUrl.endsWith(".css") && !reqUrl.endsWith(".js") && !reqUrl.endsWith(".html")
				&& !reqUrl.endsWith(".htm")) {
			if (null == loginUser || null == loginUser.userId || null == loginUser.isAdmin
					|| !loginUser.isAdmin.equals("Y")) {
//				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				// response.sendRedirect("/adminLogin");
			}
		}
		chain.doFilter(req, res);
	}

	public void destroy() {
	}

	public void init(FilterConfig arg0) throws ServletException {
	}

}
