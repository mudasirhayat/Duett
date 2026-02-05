import uuid
import boto3
from botocore.exceptions import NoCredentialsError
from django.conf import settings


def create_s3_client(aws_access_key_id, aws_secret_access_key, region_name):
    """
    Create an S3 client using specified AWS credentials
    """
    return boto3.client(
        "s3",
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
        region_name=region_name,
    )


client = create_s3_client(
    aws_access_key_id=settings.AWS_ACCESS_KEY,
    aws_secret_access_key=settings.AWS_SECRET_KEY,
    region_name=settings.AWS_REGION,
)


def upload_to_s3(file, file_name):
    """
    Upload a file to an S3 bucket

    :param file: File to upload
    :param file_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    # Upload the file
    try:
        file_extension = file_name.split('.')[-1]
        file_name = str(uuid.uuid4())[2:]
        file_name = file_name + "." + file_extension
        response = client.upload_fileobj(
            file, settings.AWS_STORAGE_BUCKET_NAME, file_name
        )
    except NoCredentialsError:
        print("Credentials not available")
        return False
    except FileNotFoundError:
        print("The file was not found")
        return False
    except Exception as e:
        print(f"An error occurred: {e}")
try:
    return f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{file_name}"
except Exception as e:
    print(f"An error occurred: {e}")
    return False
