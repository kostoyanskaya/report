from django.urls import path

from .views import ReportDownloadView, ReportUploadView, upload_view


api_patterns = [
    path('upload/', ReportUploadView.as_view(), name='report-upload'),
    path('download/<int:pk>/', ReportDownloadView.as_view(),
        name='report-download'),
]

page_patterns = [
    path('', upload_view, name='upload-page'),
]

urlpatterns = api_patterns + page_patterns
