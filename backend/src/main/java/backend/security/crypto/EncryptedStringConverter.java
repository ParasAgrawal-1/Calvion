package backend.security.crypto;

import backend.service.CryptoService;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class EncryptedStringConverter implements AttributeConverter<String, String> {

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null || attribute.isBlank()) {
            return attribute;
        }
        CryptoService cryptoService = CryptoService.getInstance();
        if (cryptoService == null) {
            return attribute;
        }
        return cryptoService.encryptText(attribute);
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return dbData;
        }
        CryptoService cryptoService = CryptoService.getInstance();
        if (cryptoService == null) {
            return dbData;
        }
        return cryptoService.decryptText(dbData);
    }
}
