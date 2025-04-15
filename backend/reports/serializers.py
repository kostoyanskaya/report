from rest_framework import serializers

from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = [
            'id',
            'original_file',
            'generated_report',
            'is_processed',
            'created_at'
        ]
        read_only_fields = [
            'id',
            'generated_report',
            'is_processed',
            'created_at'
        ]
