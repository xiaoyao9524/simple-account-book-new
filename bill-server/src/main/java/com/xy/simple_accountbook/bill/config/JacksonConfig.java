package com.xy.simple_accountbook.bill.config;

import org.springframework.boot.jackson.autoconfigure.JsonMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.core.JsonParser;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.ValueDeserializer;
import tools.jackson.databind.module.SimpleModule;

@Configuration
public class JacksonConfig {

    @Bean
    public JsonMapperBuilderCustomizer trimCustomizer() {
        return builder -> {
            SimpleModule module = new SimpleModule("trimModule");
            module.addDeserializer(String.class, new ValueDeserializer<String>() {
                @Override
                public String deserialize(JsonParser p, DeserializationContext ctxt) {
                    String value = p.getValueAsString();
                    if (value == null) return null;
                    String trimmed = value.trim();
                    return trimmed.isEmpty() ? null : trimmed;
                }

                @Override
                public String getEmptyValue(DeserializationContext ctxt) {
                    return null;
                }
            });
            builder.addModule(module);
        };
    }
}