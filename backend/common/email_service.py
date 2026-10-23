
import logging
import os

import sib_api_v3_sdk
from dotenv import load_dotenv
from sib_api_v3_sdk.rest import ApiException

load_dotenv()

logger = logging.getLogger(__name__)


def send_app_email(to_email, subject, text_body):
    api_key = os.getenv("BREVO_API_KEY")
    sender_email = os.getenv("BREVO_SENDER_EMAIL")

    if not api_key or not sender_email:
        logger.warning(
            "Brevo email config is missing; email was not sent to %s. "
            "Set BREVO_API_KEY and BREVO_SENDER_EMAIL to enable outbound emails.",
            to_email,
        )
        return {
            "debug": True,
            "to_email": to_email,
            "subject": subject,
            "text_body": text_body,
        }

    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key["api-key"] = api_key

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )

    email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": to_email}],
        sender={
            "name": "CraftConnect",
            "email": sender_email,
        },
        subject=subject,
        text_content=text_body,
    )

    try:
        return api_instance.send_transac_email(email)
    except ApiException as error:
        raise RuntimeError(f"Brevo email sending failed: {error}") from error
