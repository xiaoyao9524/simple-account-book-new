package com.xy.simple_accountbook.bill.config;

import org.springframework.boot.jackson.autoconfigure.JsonMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.core.JsonGenerator;
import tools.jackson.core.JsonParser;
import tools.jackson.databind.BeanDescription;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.SerializationConfig;
import tools.jackson.databind.SerializationContext;
import tools.jackson.databind.ValueDeserializer;
import tools.jackson.databind.ValueSerializer;
import tools.jackson.databind.module.SimpleModule;
import tools.jackson.databind.ser.BeanPropertyWriter;
import tools.jackson.databind.ser.ValueSerializerModifier;

import java.util.List;

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

    @Bean
    public JsonMapperBuilderCustomizer nullStringCustomizer() {
        ValueSerializer<Object> nullStringSerializer = new ValueSerializer<Object>() {
            @Override
            public void serialize(Object value, JsonGenerator gen, SerializationContext ctxt) {
                gen.writeString("");
            }
        };

        return builder -> {
            SimpleModule module = new SimpleModule("nullStringModule");
            module.setSerializerModifier(new ValueSerializerModifier() {
                @Override
                public List<BeanPropertyWriter> changeProperties(
                        SerializationConfig config,
                        BeanDescription.Supplier beanDesc,
                        List<BeanPropertyWriter> beanProperties) {
                    for (BeanPropertyWriter writer : beanProperties) {
                        if (writer.getType().getRawClass() == String.class) {
                            writer.assignNullSerializer(nullStringSerializer);
                        }
                    }
                    return beanProperties;
                }
            });
            builder.addModule(module);
        };
    }
}
