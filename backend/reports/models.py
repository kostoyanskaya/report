from django.db import models

from core.models import TimeStampedModel


class Report(TimeStampedModel):
    original_file = models.FileField(upload_to='uploads/')
    generated_report = models.FileField(upload_to='reports/',
                                        null=True, blank=True)
    is_processed = models.BooleanField(default=False)

    def __str__(self):
        return f"Report {self.id} - {self.created_at}"
