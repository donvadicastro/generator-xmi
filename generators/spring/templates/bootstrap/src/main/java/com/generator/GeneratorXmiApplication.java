package com.generator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import springfox.documentation.spring.data.rest.configuration.SpringDataRestConfiguration;

@SpringBootApplication
@Import(SpringDataRestConfiguration.class)
public class GeneratorXmiApplication {
    public static void main(String[] args) {
        SpringApplication.run(GeneratorXmiApplication.class, args);
    }
}
