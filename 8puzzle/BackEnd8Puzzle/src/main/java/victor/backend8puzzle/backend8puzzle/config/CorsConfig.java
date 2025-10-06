package victor.backend8puzzle.backend8puzzle.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") //aqui vai liberar o front para roda em localhost:3000 e para todos os endpoints da controller
                .allowedOrigins("http://localhost:3000") // essa URL vou usar para o meu front
                .allowedMethods("GET","POST", "OPTIONS") //métodos usado no trabalho
                .allowedHeaders("*") // vai aceitar todos os headers
                .allowCredentials(true); // cookies/credenciais se caso for necessario usar
    }
}
