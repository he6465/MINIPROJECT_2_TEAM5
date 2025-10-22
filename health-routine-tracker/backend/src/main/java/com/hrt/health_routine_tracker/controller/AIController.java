package com.hrt.health_routine_tracker.controller;

import com.hrt.health_routine_tracker.dto.ai.AIInsightRequest;
import com.hrt.health_routine_tracker.service.AIService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @Operation(
            summary = "주간 요약으로 AI 인사이트 생성",
            description = "주간 평균 수면/운동일수/평균 수분섭취 및 운동 타입을 기반으로 외부 LLM을 호출해 인사이트 텍스트를 반환합니다.",
            requestBody = @RequestBody(required = true, content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = AIInsightRequest.class))),
            responses = {
                    @ApiResponse(responseCode = "200", description = "성공", content = @Content(mediaType = MediaType.TEXT_PLAIN_VALUE)),
                    @ApiResponse(responseCode = "500", description = "서버 오류")
            }
    )
    @PostMapping("/insight")
    public ResponseEntity<String> getInsight(@org.springframework.web.bind.annotation.RequestBody @Valid AIInsightRequest request) {
        String result = aiService.generateInsight(request);
        return ResponseEntity.ok(result);
    }
}


