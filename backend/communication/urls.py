from django.urls import path
from django.urls import path
from .views import ConversationListCreateView, MessageListCreateView, MarkMessagesReadView

urlpatterns = [
    path('conversations/', ConversationListCreateView.as_view(), name='conversation-list-create'),
    path('conversations/<int:conversation_id>/messages/', MessageListCreateView.as_view(), name='message-list-create'),
    path('conversations/<int:conversation_id>/read/', MarkMessagesReadView.as_view(), name='mark-read'),
]
urlpatterns = []