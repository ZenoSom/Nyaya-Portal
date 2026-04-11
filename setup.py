from setuptools import setup, find_packages

setup(
    name="nyaya-portal-openenv",
    version="0.1.0",
    packages=find_packages(include=["server*", "graders*"]),
    install_requires=[
        "fastapi>=0.110.0",
        "uvicorn[standard]>=0.30.0",
        "openai>=2.7.2",
        "openenv-core>=0.2.0",
    ],
)
