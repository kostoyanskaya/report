import os
import tempfile

from django.shortcuts import get_object_or_404, redirect, render
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from core.services import ReportGenerator
from .models import Report


class ReportUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response(
                {'error': 'Файл не предоставлен'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not file_obj.name.lower().endswith('.csv'):
            return Response(
                {'error': 'Файл должен быть в формате CSV'},
                status=status.HTTP_400_BAD_REQUEST
            )

        report = Report.objects.create(original_file=file_obj)
        generator = ReportGenerator()
        doc = generator.generate_road_report(report.original_file.path)

        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.docx')
        doc.save(temp_file.name)
        temp_file.close()

        with open(temp_file.name, 'rb') as f:
            report.generated_report.save(f'report_{report.id}.docx', f)

        report.is_processed = True
        report.save()
        os.unlink(temp_file.name)

        file_url = request.build_absolute_uri(report.generated_report.url)
        return Response({
            'id': report.id,
            'download_url': file_url,
            'status': 'success'
        }, status=status.HTTP_201_CREATED)


class ReportDownloadView(APIView):
    def get(self, request, pk, format=None):
        report = get_object_or_404(Report, pk=pk)

        if not report.generated_report:
            return Response(
                {'error': 'Отчет еще не сгенерирован'},
                status=status.HTTP_404_NOT_FOUND
            )

        return redirect(report.generated_report.url)


def upload_view(request):
    return render(request, 'reports/upload.html')
