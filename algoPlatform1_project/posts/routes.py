from flask import (render_template, url_for, flash,
                   redirect, request, abort, Blueprint)
from flask_login import current_user, login_required
from algoPlatform1_project import db, app
from algoPlatform1_project.models import Post, User
from algoPlatform1_project.posts.forms import PostForm
import jwt, os, json
import datetime
from sqlalchemy.orm.attributes import flag_modified
from sqlalchemy import desc

app.config['SECRET_KEY'] = os.environ.get('AlgoPlatformSecretKey')
posts = Blueprint('posts',__name__)



@posts.route("/fourm")
def fourm():
    page = request.args.get('page', 1, type=int)
    posts = Post.query.order_by(Post.date_posted.desc()).paginate(page=page, per_page=10)
    
    # def print_result(n):
    #     return print(str(n['content']))

    # result = map(print_result,posts)
    return render_template('fourm.html', posts=posts, active='fourm')

@posts.route("/posts/<page>",methods=['GET'])
def return_posts(page):   
    rows = Post.query.count()
    posts = Post.query.filter(Post.id > (rows-(10*int(page))), Post.id < (rows-(10*int(page))+11)).order_by(desc(Post.date_posted))
    export = []
    for p in posts:
        export.append({'user':str(User.query.get(p.user_id).username),'date':str(p.date_posted.month)+'/'+str(p.date_posted.day)+'/'+str(p.date_posted.year)[-2:],'content':p.content,'id':p.id,'chartData':p.chartData,'replies':p.replies})
    return json.dumps(export)

@posts.route("/post/reply/", methods=['GET', 'POST'])
@login_required
def new_reply():
    if current_user.is_authenticated:
        req_data = request.get_json()
        postToReply = Post.query.filter_by(id=(req_data['id'])).first()
        currentReplies = postToReply.replies
        currentDate = datetime.date.today()
        year = currentDate.year
        year = year - 2000
        if currentReplies is None:
            postToReply.replies = [{'reply':req_data['reply'],'userWhoReplied':current_user.username,'dateReplied':str(currentDate.month)+'/'+str(currentDate.day)+'/'+str(year)}]
            db.session.add(postToReply)
            db.session.commit()
        else:
            addNewReply = postToReply.replies
            addNewReply.insert(0,{'reply':req_data['reply'],'userWhoReplied':current_user.username,'dateReplied':str(currentDate.month)+'/'+str(currentDate.day)+'/'+str(year)})
            postToReply.replies = addNewReply
            flag_modified(postToReply, 'replies')
            #db.session.add(postToReply)
            #db.session.flush()
            db.session.commit()
        response = {'type':'success'}
        return response
    response = {'type':'failure'}
    return response


#postToReply.replies = json.dumps(json.loads(postToReply.replies).append({'reply':req_data['reply']}))
#db.session.add(postToReply)
#db.session.commit()
#print(postToReply.replies.append({'test':'test'}))
@posts.route("/post/new/", methods=['GET', 'POST'])
@login_required
def new_post():
    if current_user.is_authenticated:
        req_data = request.get_json()
        #title = req_data['title']
        content = req_data['content']
        chartData = req_data['chartData']
        post = Post(content=content,author=current_user,chartData=json.loads(chartData))
        db.session.add(post)
        db.session.commit()
        response = {'type':'success'}
        return response
    response = {'type':'failure'}
    return response




@posts.route("/post/<int:post_id>")
def post(post_id):
    post = Post.query.get_or_404(post_id)
    return render_template('post.html', title=post.title, post=post)


@posts.route("/post/<int:post_id>/update", methods=['GET', 'POST'])
@login_required
def update_post(post_id):
    post = Post.query.get_or_404(post_id)
    if post.author != current_user:
        abort(403)
    form = PostForm()
    if form.validate_on_submit():
        post.title = form.title.data
        post.content = form.content.data
        db.session.commit()
        flash('Your post has been updated!', 'success')
        return redirect(url_for('posts.post', post_id=post.id))
    elif request.method == 'GET':
        form.title.data = post.title
        form.content.data = post.content
    return render_template('create_post.html', title='Update Post',
                           form=form, legend='Update Post')


@posts.route("/post/<int:post_id>/delete", methods=['POST'])
@login_required
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    if post.author != current_user:
        abort(403)
    db.session.delete(post)
    db.session.commit()
    flash('Your post has been deleted!', 'success')
    return redirect(url_for('posts.fourm'))






# form = PostForm()
# if form.validate_on_submit():
#     post = Post(title=form.title.data, content=form.content.data, author=current_user, charData=form.chartDataJSON.data)
#     db.session.add(post)
#     db.session.commit()
#     flash('Your post has been created!', 'success')
#     return redirect(url_for('posts.fourm'))
# return render_template('create_post.html', title='New Post',
#                        form=form, legend='New Post')