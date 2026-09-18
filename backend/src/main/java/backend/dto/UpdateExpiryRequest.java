package backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateExpiryRequest {

    private String expiryDate; // YYYY-MM-DD

    private Integer alertThresholdDays; // e.g. 7, 14, 30, 60, 90

    private String expiryNotes;
}
