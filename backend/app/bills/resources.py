"""
APIs for managing bills.
"""
import json
import os
from flask import Blueprint, request
from flask_restful import Resource, Api
from app.models import db, Bills, User
from app.utils import AlchemyEncoder
from datetime import datetime
from werkzeug.utils import secure_filename
from flask_jwt_extended import get_jwt_identity, jwt_required

mod_bills = Blueprint("bills", __name__)
api_bills = Api()
api_bills.init_app(mod_bills)


class UploadBill(Resource):
    """
      APIs to upload and get bill.
    """

    @jwt_required()
    def get(self, id=None):
        """
        :return: Returns all the bills
        """
        try:
            current_user = get_jwt_identity()
            user = User.query.filter_by(id=current_user['id']).first()
            if user is None:
                return {"result": "User does not exist."}, 404
            if id is None:
                bills = Bills.query.all()
                bills_list = json.dumps(bills, cls=AlchemyEncoder)
                return {"result": json.loads(bills_list)}
            else:
                bill = Bills.query.get(id)
                bill_obj = json.dumps(bill, cls=AlchemyEncoder)
                return {"result": json.loads(bill_obj)}
        except KeyError as error:
            return {"result": "Key error", "error": str(error)}, 400
        except Exception as error:
            return {"result": "Exception occurred", "error": str(error)}, 400

    @jwt_required()
    def post(self):
        """
        Uploads the bill to the system.
        """
        try:
            current_user = get_jwt_identity()
            user = User.query.filter_by(id=current_user['id']).first()
            if user is None:
                return {"result": "User does not exist."}, 404

            file = request.files['image']
            filename = secure_filename(file.filename)
            absolute_path = os.path.abspath("../frontend/" + "public/" + filename)
            file.save(absolute_path)

            bill_obj = Bills(
                first_name=request.form['firstName'],
                last_name=request.form['lastName'],
                address=request.form['address'],
                hospital_name=request.form['hospitalName'],
                amount=request.form['billAmount'],
                service_date=datetime.strptime(request.form['serviceDate'], '%m/%d/%Y') if request.form['serviceDate']
                                                                                           != "null" else None,
                bill_image=absolute_path
            )
            db.add(bill_obj)
            db.commit()

            return {"result": "Successfully uploaded bill."}

        except TypeError as error:
            return {"result": "Key error", "error": str(error)}, 400
        except Exception as error:
            return {"result": "Exception occurred", "error": str(error)}, 40

    @jwt_required()
    def put(self, id):
        """
        Updates the bill to the system.
        """
        try:
            current_user = get_jwt_identity()
            user = User.query.filter_by(id=current_user['id']).first()
            if user is None:
                return {"result": "User does not exist."}, 404

            file = request.files['image']
            filename = secure_filename(file.filename)
            absolute_path = os.path.abspath("../frontend/" + "public/" + filename)
            file.save(absolute_path)

            bill = Bills.query.get(id)
            if bill is not None:
                bill.first_name = request.form['firstName'],
                bill.last_name = request.form['lastName'],
                bill.address = request.form['address'],
                bill.hospital_name = request.form['hospitalName'],
                bill.amount = request.form['billAmount'],
                bill.service_date = datetime.strptime(request.form['serviceDate'].split(" ")[0], '%Y-%m-%d'),
                bill.bill_image = absolute_path
                db.add(bill)
                db.commit()

                return {"result": "Successfully updated bill."}

            else:
                return {"result": "Bill not found"}, 404

        except KeyError as error:
            return {"result": "Key error", "error": str(error)}, 400
        except Exception as error:
            return {"result": "Exception occurred", "error": str(error)}, 40


api_bills.add_resource(UploadBill, '/upload_bill', '/upload_bill/<string:id>')
