package com.school;

import com.dsfa.preview.service.IPreviewService;
import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@ComponentScan({"com.school","com.dsfa","com.dsf"})
@EnableAsync //开启异步调用
@EnableFeignClients(basePackageClasses = IPreviewService.class)//开启Feign
public class DreamDsfaSchoolSituationApplication {

    public static void main(String[] args) {
        SpringApplication sa = new SpringApplication(DreamDsfaSchoolSituationApplication.class);
        sa.setBannerMode(Banner.Mode.CONSOLE);
        sa.run(args);
    }

}
