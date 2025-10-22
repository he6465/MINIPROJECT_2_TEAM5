package com.hrt.health_routine_tracker.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hrt.health_routine_tracker.dto.ai.AIInsightRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIService {

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String openaiApiUrl;

    @Value("${ai.enabled:false}")
    private boolean aiEnabled;
    @Value("${openai.api.model:gpt-3.5-turbo}")
    private String openaiModel;
    @Value("${openai.api.timeout-ms:10000}")
    private int timeoutMs;

    private RestTemplate restTemplate = createRestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateInsight(AIInsightRequest request) {
        if (!aiEnabled || openaiApiKey == null || openaiApiKey.isBlank()) {
            return "AI가 아직 비활성화되어 있습니다. 키 설정 후 사용해 주세요.";
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);

            Map<String, Object> userMsg = new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", buildPrompt(request));

            Map<String, Object> body = new HashMap<>();
            body.put("model", openaiModel);
            body.put("messages", List.of(userMsg));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> res = restTemplate.exchange(openaiApiUrl, HttpMethod.POST, entity, String.class);

            if (!res.getStatusCode().is2xxSuccessful() || res.getBody() == null) {
                return "AI 분석을 완료할 수 없습니다.";
            }

            JsonNode root = objectMapper.readTree(res.getBody());
            JsonNode choices = root.path("choices");
            if (choices.isArray() && choices.size() > 0) {
                JsonNode message = choices.get(0).path("message");
                String content = message.path("content").asText("");
                if (!content.isBlank()) return content;
            }
            return "AI 분석을 완료할 수 없습니다.";
        } catch (Exception e) {
            return "AI 분석 중 오류가 발생했습니다.";
        }
    }

    private String buildPrompt(AIInsightRequest req) {
        return String.format(
                """
                사용자의 건강 루틴 데이터를 분석해주세요:\n
                - 평균 수면: %.1f시간\n
                - 운동 횟수: %d일\n
                - 물 섭취량: %dml\n
                - 선호 운동: %s\n
                
                위 데이터를 바탕으로 개인화된 건강 인사이트를 3~5줄로 한국어로 제공해 주세요.\n
                톤은 친근하고 격려하는 방식으로 해주세요.
                """,
                req.getAvgSleep(),
                req.getExerciseDays(),
                req.getAvgWater(),
                req.getExerciseType() == null ? "미입력" : req.getExerciseType()
        );
    }

    private RestTemplate createRestTemplate() {
        SimpleClientHttpRequestFactory f = new SimpleClientHttpRequestFactory();
        f.setConnectTimeout(timeoutMs);
        f.setReadTimeout(timeoutMs);
        return new RestTemplate(f);
    }
}


