import logging
import os
from logging.handlers import RotatingFileHandler
from datetime import datetime

class SizeAndTimeRotatingFileHandler(RotatingFileHandler):
    def __init__(self, filename, maxBytes=0, encoding=None, delay=False):
        super().__init__(
            filename=filename,
            maxBytes=maxBytes,
            backupCount=0,
            encoding=encoding,
            delay=delay
        )

    def doRollover(self):
        if self.stream:
            self.stream.close()
            self.stream = None

        if os.path.exists(self.baseFilename):
            current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S-%f")
            new_name = f"{self.baseFilename}.{current_time}"
            os.rename(self.baseFilename, new_name)

        if not self.delay:
            self.stream = self._open()

def setup_logger(name, log_file='app.log', level=logging.INFO):
    logger = logging.getLogger(name)
    logger.setLevel(level)

    if logger.handlers:
        return logger

    formatter = logging.Formatter(
        '%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    file_handler = SizeAndTimeRotatingFileHandler(
        log_file,
        maxBytes=500*1024*1024,
        encoding='utf-8'
    )
    file_handler.setFormatter(formatter)

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

    return logger