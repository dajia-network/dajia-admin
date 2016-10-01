package com.dajia;

import com.dajia.admin.filter.AdminFilter;
import org.springframework.boot.autoconfigure.web.WebMvcAutoConfiguration.WebMvcAutoConfigurationAdapter;
import org.springframework.boot.context.embedded.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.servlet.Filter;

@Configuration
@EnableWebMvc
public class ServerConfig extends WebMvcAutoConfigurationAdapter {

	@Bean
	public FilterRegistrationBean adminFilterRegistration() {
		FilterRegistrationBean registration = new FilterRegistrationBean();
		registration.setFilter(adminFilter());
		registration.addUrlPatterns("/admin/*");
		registration.setName("adminFilter");
		return registration;
	}

	@Bean(name = "adminFilter")
	public Filter adminFilter() {
		return new AdminFilter();
	}

}
