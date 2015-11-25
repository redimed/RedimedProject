//
//  rtelePhoneCallViewController.swift
//  telehealth
//
//  Created by Huy Nguyễn on 9/3/15.
//  Copyright (c) 2015 REDiMED. All rights reserved.
//

import UIKit

let videoWidth : CGFloat = 200
let videoHeight : CGFloat = 120

// *** Fill the following variables using your own Project info  ***
// ***          https://dashboard.tokbox.com/projects            ***
// Replace with your OpenTok API key
let ApiKey = "45317072"
//// Replace with your generated session ID
var SessionID : String = String()
//// Replace with your generated token
var Token : String = String()

var sessionIDReceive : String = String()

var tokenIDReceive : String = String()

// Change to YES to subscribe to your own stream.
let SubscribeToSelf = false

//Declare a user
let defaults = NSUserDefaults.standardUserDefaults()
public let id = defaults.stringForKey("memId") as String!
public let username = defaults.stringForKey("username") as String!
let info : NSDictionary = ["memId": id, "username": username]

class rtelePhoneCallViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, OTSessionDelegate, OTSubscriberKitDelegate, OTPublisherDelegate {
    
    @IBOutlet weak var tableView: UITableView!
    
    let socket = SocketIOClient(socketURL: "http://testapp.redimed.com.au:3010")
    var onlineUser:NSMutableArray!
    var count = 0
    var session : OTSession?
    var publisher : OTPublisher?
    var subscriber : OTSubscriber?
    var screenRect : CGRect = UIScreen.mainScreen().bounds
    
    var from : NSDictionary!
    
    var to : NSDictionary!
    var toUserReceiveCall : NSDictionary!
    
    var message : NSDictionary!
    
    var topConstraint : NSLayoutConstraint!
    var leftConstraint : NSLayoutConstraint!
    var rightConstraint : NSLayoutConstraint!
    var bottomConstraint : NSLayoutConstraint!
    var callSound = NSURL(fileURLWithPath: NSBundle.mainBundle().pathForResource("call", ofType: "wav")!)
    var receiveSound = NSURL(fileURLWithPath: NSBundle.mainBundle().pathForResource("receive", ofType: "wav")!)
    var audioPlayerforCall = AVAudioPlayer()
    var audioPlayerforReceive = AVAudioPlayer()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.addHandlers()
        self.socket.connect()
        
        self.tableView.tableFooterView = UIView(frame: CGRectZero)
        tableView.hidden = true
        self.navigationItem.leftBarButtonItem = UIBarButtonItem(title: nil, style: UIBarButtonItemStyle.Plain, target: self, action:"backAction:")
    }
    
    func backAction(sender: UIBarButtonItem) {
        self.socket.emit("logout", id)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    func addHandlers() {
        self.socket.on("connectSuccess") {[weak self] data, ack in
            
            self!.socket.emit("loggedIn", info)
            
            self!.socket.emit("onlineUser")
            
            self!.socket.on("onlineUser") {[weak self] data, ack in
                self!.onlineUser = data![0] as? NSMutableArray
                self!.count = self!.onlineUser.count
                let jsonData = JSON(data![0])
                for var i = 0; i < self!.onlineUser.count ; ++i {
                    if (jsonData[i]["username"].stringValue == username) {
                        self!.onlineUser.removeObjectAtIndex(i)
                        self!.count = self!.onlineUser.count
                    }
                }
                self!.tableView.reloadData()
            }
            
            self!.socket.on("sessionGenerated") {[weak self] data, ack in
                let json = JSON(data!)
                let sessionGenerate = json[0]["sessionId"].stringValue
                let tokenGenerate = json[0]["token"].stringValue
                SessionID = sessionGenerate
                Token = tokenGenerate
                self!.session = OTSession(apiKey: ApiKey, sessionId: SessionID, delegate: self)
                self!.doConnect()
            }
            
            self!.socket.on("receiveMessage") {[weak self] data, ack in
                
                let jsonData  = JSON(data!)
                self!.toUserReceiveCall = data![0] as! NSDictionary
                let nameCalling = jsonData[0]["username"].stringValue
                let sessionID = jsonData[1]["sessionId"].stringValue
                let tokenID = jsonData[1]["token"].stringValue
                
                if (jsonData[1]["type"].stringValue == "call") {
                    self!.handeCall(nameCalling, sessionId: sessionID, tokenId: tokenID)
                } else if(jsonData[1]["type"].stringValue == "ignore") {
                    if (self!.audioPlayerforCall.playing) {
                        self!.audioPlayerforCall.stop()
                    } else {
                        self!.audioPlayerforReceive.stop()
                    }
                    self!.sessionDidDisconnect(self!.session!)
                    self!.tableView.hidden = false
                    self!.navigationController?.setNavigationBarHidden(false, animated: true)
                    self!.tableView.reloadData()
                    self!.doPublish()
                    JLToast.makeText(nameCalling + " ignore call").show()
                    
                } else if(jsonData[1]["type"].stringValue == "end") {
                    
                    self!.sessionDidDisconnect(self!.session!)
                    self!.navigationController?.setNavigationBarHidden(false, animated: true)
                    self!.navigationController?.popToRootViewControllerAnimated(true)
                    // self!.tableView.hidden = false
                    // self!.navigationController?.setNavigationBarHidden(false, animated: true)
                    // self!.tableView.reloadData()
                    // self!.publisher!.view.addSubview(self!.tableView)
                    // self!.doPublish()
                    
                } else if (jsonData[1]["type"].stringValue == "answer") {
                    self!.audioPlayerforCall.stop()
                    self!.view.addSubview(self!.tableView)
                }
            }
        }
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCellWithIdentifier("Cell", forIndexPath: indexPath) as! UITableViewCell
        
        let employees: NSDictionary = self.onlineUser[indexPath.row] as! NSDictionary
        
        for employee in employees {
            let userNameTable = employees["username"] as! String
            cell.textLabel!.text = userNameTable
            cell.textLabel!.textColor = UIColor.whiteColor()
        }
        return cell
    }
    
    func tableView(tableView: UITableView, willDisplayCell cell: UITableViewCell, forRowAtIndexPath indexPath: NSIndexPath) {
        cell.backgroundColor = UIColor.clearColor()
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        hanleMessageCall(onlineUser[indexPath.row] as! NSDictionary, calling: true)
    }
    
    //    function endcall, answercall, ignorecall
    func EndCall(sender: UIButton) {
        message = ["type": "end"]
        socket.emit("sendMessage", from, to, message)
        
        sessionDidDisconnect(session!)
        navigationController?.setNavigationBarHidden(false, animated: true)
        navigationController?.popToRootViewControllerAnimated(true)
        //            [self.navigationController popToRootViewControllerAnimated:YES];
        //        tableView.hidden = false
        
        //        tableView.reloadData()
        //        doPublish()
    }
    
    func IgnoreCall(sender: UIButton) {
        message = ["type": "ignore"]
        if(sender.tag == 0) {
            audioPlayerforCall.stop()
        } else if (sender.tag == 1) {
            audioPlayerforReceive.stop()
        }
        socket.emit("sendMessage", from, to, message)
        sessionDidDisconnect(session!)
        tableView.hidden = false
        navigationController?.setNavigationBarHidden(false, animated: true)
        tableView.reloadData()
        doPublish()
    }
    
    func AcceptCall(sender: UIButton) {
        
        //        publisher?.view.removeFromSuperview()
        
        audioPlayerforReceive.stop()
        
        message = ["type": "answer"]
        
        socket.emit("sendMessage", from, to, message)
        
        self.session = OTSession(apiKey: ApiKey, sessionId: sessionIDReceive, delegate: self)
        
        if let session = self.session {
            
            var maybeError : OTError?
            
            session.connectWithToken(tokenIDReceive, error: &maybeError)
            
            if let error = maybeError {
                self.showAlert(error.localizedDescription)
            }
            
        }
        
    }
    
    func SubscriberClick(sender: UITapGestureRecognizer) {
        
    }
    //    end function calling
    
    
    
    func handeCall(nameCalling: String, sessionId: String, tokenId: String) {
        
        audioPlayerforReceive = AVAudioPlayer(contentsOfURL: receiveSound, error: nil)
        audioPlayerforCall = AVAudioPlayer(contentsOfURL: callSound, error: nil)
        audioPlayerforReceive.prepareToPlay()
        audioPlayerforReceive.play()
        audioPlayerforReceive.numberOfLoops = -5
        
        sessionIDReceive = sessionId
        tokenIDReceive = tokenId
        
        from = info
        to = toUserReceiveCall
        
        tableView.hidden = true
        navigationController?.setNavigationBarHidden(true, animated: true)
        publisher?.view.removeConstraints([topConstraint, leftConstraint, rightConstraint, bottomConstraint])
        
        
        let nameCall = UILabel(frame: CGRectMake(0, 0, 200, 70))
        nameCall.text = nameCalling
        nameCall.center = CGPointMake(UIScreen.mainScreen().bounds.size.width/2, 50)
        nameCall.textAlignment = NSTextAlignment.Center
        nameCall.font = UIFont(name: "HelveticaNeue-UltraLight", size: 50)
        nameCall.textColor = UIColor.whiteColor()
        
        let callingTitle = UILabel(frame: CGRectMake(0, 0, 200, 70))
        callingTitle.text = "would like call..."
        callingTitle.center = CGPointMake(UIScreen.mainScreen().bounds.size.width/2, 100)
        callingTitle.textAlignment = NSTextAlignment.Center
        callingTitle.font = UIFont(name: "HelveticaNeue-Light", size: 25)
        callingTitle.textColor = UIColor.whiteColor()
        
        
        let ignoreButton : UIButton = UIButton.buttonWithType(UIButtonType.Custom) as! UIButton
        ignoreButton.frame = CGRectMake(0, 0, 80, 80)
        ignoreButton.center = CGPointMake(UIScreen.mainScreen().bounds.size.width/2 - 120 , 680)
        ignoreButton.layer.cornerRadius = 0.5 * ignoreButton.bounds.size.width
        ignoreButton.backgroundColor = UIColor.redColor()
        ignoreButton.tag = 1
        ignoreButton.addTarget(self, action: "IgnoreCall:", forControlEvents: UIControlEvents.TouchDown)
        ignoreButton.setTitle("Decline", forState: UIControlState.Normal)
        
        let answerButton : UIButton = UIButton.buttonWithType(UIButtonType.Custom) as! UIButton
        answerButton.frame = CGRectMake(0, 0, 80, 80)
        answerButton.center = CGPointMake(UIScreen.mainScreen().bounds.size.width/2 + 120 , 680)
        answerButton.layer.cornerRadius = 0.5 * answerButton.bounds.size.width
        answerButton.backgroundColor = UIColor.greenColor()
        answerButton.addTarget(self, action: "AcceptCall:", forControlEvents: UIControlEvents.TouchDown)
        answerButton.setTitle("Accept", forState: UIControlState.Normal)
        
        publisher?.view.addSubview(ignoreButton)
        publisher?.view.addSubview(answerButton)
        publisher?.view.addSubview(nameCall)
        publisher?.view.addSubview(callingTitle)
        
    }
    
    func hanleMessageCall(objectUser: NSDictionary, calling: Bool) {
        
        tableView.hidden = true
        navigationController?.setNavigationBarHidden(true, animated: true)
        publisher?.view.removeConstraints([topConstraint, leftConstraint, rightConstraint, bottomConstraint])
        
        if (calling) {
            
            
            audioPlayerforCall = AVAudioPlayer(contentsOfURL: callSound, error: nil)
            audioPlayerforCall.prepareToPlay()
            audioPlayerforCall.play()
            audioPlayerforCall.numberOfLoops = -5
            
            from = info
            to = objectUser
            message = ["type": "call", "sessionId": SessionID]
            
            socket.emit("sendMessage", from, to, message)
            
            let nameCall = UILabel(frame: CGRectMake(0, 0, 200, 70))
            nameCall.text = objectUser["username"] as? String
            nameCall.center = CGPointMake(UIScreen.mainScreen().bounds.size.width/2, 50)
            nameCall.textAlignment = NSTextAlignment.Center
            nameCall.font = UIFont(name: "HelveticaNeue-UltraLight", size: 50)
            nameCall.textColor = UIColor.whiteColor()
            
            let callingTitle = UILabel(frame: CGRectMake(0, 0, 200, 70))
            callingTitle.text = "Calling..."
            callingTitle.center = CGPointMake(UIScreen.mainScreen().bounds.size.width/2, 100)
            callingTitle.textAlignment = NSTextAlignment.Center
            callingTitle.font = UIFont(name: "HelveticaNeue-Light", size: 25)
            callingTitle.textColor = UIColor.whiteColor()
            
            
            let endButton : UIButton = UIButton.buttonWithType(UIButtonType.Custom) as! UIButton
            endButton.frame = CGRectMake(0, 0, 80, 80)
            endButton.center = CGPointMake(UIScreen.mainScreen().bounds.size.width/2 , 680)
            endButton.layer.cornerRadius = 0.5 * endButton.bounds.size.width
            endButton.backgroundColor = UIColor.redColor()
            endButton.tag = 0
            endButton.addTarget(self, action: "IgnoreCall:", forControlEvents: UIControlEvents.TouchDown)
            endButton.setTitle("Ignore", forState: UIControlState.Normal)
            
            publisher?.view.addSubview(endButton)
            publisher?.view.addSubview(nameCall)
            publisher?.view.addSubview(callingTitle)
        } else {
            
            publisher!.view.frame = CGRect(x: (UIScreen.mainScreen().bounds.size.width - videoWidth) - 10, y: 40, width: videoWidth, height: videoHeight)
            
            let titleLabel = UILabel(frame: CGRectMake(0, 0, 200, 70))
            titleLabel.text = "Calling with"
            titleLabel.center = CGPointMake(UIScreen.mainScreen().bounds.size.width/2, 70)
            titleLabel.textAlignment = NSTextAlignment.Center
            titleLabel.font = UIFont(name: "HelveticaNeue-Regular", size: 30)
            titleLabel.textColor = UIColor.whiteColor()
            
            let nameLabel = UILabel(frame: CGRectMake(0, 0, 200, 70))
            let nameCallString = objectUser["username"] as! String
            nameLabel.text = nameCallString
            nameLabel.center = CGPointMake(UIScreen.mainScreen().bounds.size.width/2, 120)
            nameLabel.textAlignment = NSTextAlignment.Center
            nameLabel.font = UIFont(name: "HelveticaNeue-UltraLight", size: 50)
            nameLabel.textColor = UIColor.whiteColor()
            
            let endButton : UIButton = UIButton.buttonWithType(UIButtonType.Custom) as! UIButton
            endButton.frame = CGRectMake(0, 0, 80, 80)
            endButton.center = CGPointMake(UIScreen.mainScreen().bounds.size.width/2 , 680)
            endButton.layer.cornerRadius = 0.5 * endButton.bounds.size.width
            endButton.backgroundColor = UIColor.redColor()
            endButton.addTarget(self, action: "EndCall:", forControlEvents: UIControlEvents.TouchDown)
            endButton.setTitle("End", forState: UIControlState.Normal)
            
            subscriber?.view.addSubview(titleLabel)
            subscriber?.view.addSubview(nameLabel)
            subscriber?.view.addSubview(endButton)
            subscriber?.view.addSubview(publisher!.view)
            
        }
    }
    
    override func preferredStatusBarStyle() -> UIStatusBarStyle {
        return UIStatusBarStyle.LightContent
    }
    
    func doConnect() {
        if let session = self.session {
            var maybeError : OTError?
            session.connectWithToken(Token, error: &maybeError)
            if let error = maybeError {
                showAlert(error.localizedDescription)
            }
        }
    }
    
    /**
    * Sets up an instance of OTPublisher to use with this session. OTPubilsher
    * binds to the device camera and microphone, and will provide A/V streams
    * to the OpenTok session.
    */
    
    func doPublish() {
        publisher = OTPublisher(delegate: self)
        
        var maybeError : OTError?
        
        session?.publish(publisher, error: &maybeError)
        
        if let error = maybeError {
            showAlert(error.localizedDescription)
        }
        
        view.addSubview(publisher!.view)
        
        var screenWidth : CGFloat = screenRect.size.width
        var screenHeight : CGFloat = screenRect.size.height
        publisher!.view.frame = CGRect(x: 0.0, y: 0, width: screenWidth, height: screenHeight)
        
        let effect = UIBlurEffect(style: UIBlurEffectStyle.Light)
        
        let overlayView = UIVisualEffectView(effect: effect)
        
        overlayView.setTranslatesAutoresizingMaskIntoConstraints(false)
        
        self.publisher?.view.insertSubview(overlayView, aboveSubview: tableView)
        
        topConstraint = NSLayoutConstraint(item: overlayView, attribute: .Top, relatedBy: .Equal, toItem: self.tableView, attribute: .Top, multiplier: 1, constant: -30)
        
        leftConstraint = NSLayoutConstraint(item: overlayView, attribute: .Left, relatedBy: .Equal, toItem: self.tableView, attribute: .Left, multiplier: 1, constant: 0)
        
        rightConstraint = NSLayoutConstraint(item: overlayView, attribute: .Right, relatedBy: .Equal, toItem: self.tableView, attribute: .Right, multiplier: 1, constant: 0)
        
        bottomConstraint = NSLayoutConstraint(item: overlayView, attribute: .Bottom, relatedBy: .Equal, toItem: self.tableView, attribute: .Bottom, multiplier: 1, constant: 0)
        
        tableView.hidden = false
        
        publisher?.view.addSubview(tableView)
        
        self.publisher?.view.addConstraints([topConstraint, leftConstraint, rightConstraint, bottomConstraint])
        
    }
    
    /**
    * Instantiates a subscriber for the given stream and asynchronously begins the
    * process to begin receiving A/V content for this stream. Unlike doPublish,
    * this method does not add the subscriber to the view hierarchy. Instead, we
    * add the subscriber only after it has connected and begins receiving data.
    */
    func doSubscribe(stream : OTStream) {
        if let session = self.session {
            subscriber = OTSubscriber(stream: stream, delegate: self)
            
            var maybeError : OTError?
            session.subscribe(subscriber, error: &maybeError)
            if let error = maybeError {
                showAlert(error.localizedDescription)
            }
        }
    }
    
    /**
    * Cleans the subscriber from the view hierarchy, if any.
    */
    func doUnsubscribe() {
        if let subscriber = self.subscriber {
            var maybeError : OTError?
            session?.unsubscribe(subscriber, error: &maybeError)
            if let error = maybeError {
                showAlert(error.localizedDescription)
            }
            
            subscriber.view.removeFromSuperview()
            self.subscriber = nil
        }
    }
    
    // MARK: - OTSession delegate callbacks
    
    func sessionDidConnect(session: OTSession) {
        NSLog("sessionDidConnect (\(session.sessionId))")
        
        // Step 2: We have successfully connected, now instantiate a publisher and
        // begin pushing A/V streams into OpenTok.
        doPublish()
    }
    
    func sessionDidDisconnect(session : OTSession) {
        NSLog("Session disconnected (\( session.sessionId))")
    }
    
    func session(session: OTSession, streamCreated stream: OTStream) {
        NSLog("session streamCreated (\(stream.streamId))")
        
        // view.addSubview(tableView)
        // Step 3a: (if NO == subscribeToSelf): Begin subscribing to a stream we
        // have seen on the OpenTok session.
        if subscriber == nil && !SubscribeToSelf {
            doSubscribe(stream)
        }
    }
    
    func session(session: OTSession, streamDestroyed stream: OTStream) {
        NSLog("session streamDestroyed (\(stream.streamId))")
        
        if subscriber?.stream.streamId == stream.streamId {
            doUnsubscribe()
        }
    }
    
    func session(session: OTSession, connectionCreated connection : OTConnection) {
        NSLog("session connectionCreated (\(connection.connectionId))")
    }
    
    func session(session: OTSession, connectionDestroyed connection : OTConnection) {
        NSLog("session connectionDestroyed (\(connection.connectionId))")
    }
    
    func session(session: OTSession, didFailWithError error: OTError) {
        NSLog("session didFailWithError (%@)", error)
    }
    
    // MARK: - OTSubscriber delegate callbacks
    
    func subscriberDidConnectToStream(subscriberKit: OTSubscriberKit) {
        NSLog("subscriberDidConnectToStream (\(subscriberKit))")
        
        var screenWidth : CGFloat = screenRect.size.width
        var screenHeight : CGFloat = screenRect.size.height
        subscriber?.view.frame =  CGRect(x: 0.0, y: 0, width: screenWidth, height: screenHeight)
        
        view.addSubview(subscriber!.view)
        
        hanleMessageCall(onlineUser[0] as! NSDictionary, calling: false)
    }
    
    func subscriber(subscriber: OTSubscriberKit, didFailWithError error : OTError) {
        NSLog("subscriber %@ didFailWithError %@", subscriber.stream.streamId, error)
    }
    
    // MARK: - OTPublisher delegate callbacks
    
    func publisher(publisher: OTPublisherKit, streamCreated stream: OTStream) {
        NSLog("publisher streamCreated %@", stream)
        
        // Step 3b: (if YES == subscribeToSelf): Our own publisher is now visible to
        // all participants in the OpenTok session. We will attempt to subscribe to
        // our own stream. Expect to see a slight delay in the subscriber video and
        // an echo of the audio coming from the device microphone.
        if subscriber == nil && SubscribeToSelf {
            doSubscribe(stream)
        }
    }
    
    func publisher(publisher: OTPublisherKit, streamDestroyed stream: OTStream) {
        NSLog("publisher streamDestroyed %@", stream)
        
        if subscriber?.stream.streamId == stream.streamId {
            doUnsubscribe()
        }
    }
    
    func publisher(publisher: OTPublisherKit, didFailWithError error: OTError) {
        NSLog("publisher didFailWithError %@", error)
    }
    
    // MARK: - Helpers
    
    func showAlert(message: String) {
        // show alertview on main UI
        dispatch_async(dispatch_get_main_queue()) {
            let al = UIAlertView(title: "OTError", message: message, delegate: nil, cancelButtonTitle: "OK")
        }
    }
    
    override func shouldAutorotate() -> Bool {
        return true
    }
    
    override func supportedInterfaceOrientations() -> Int {
        return Int(UIInterfaceOrientationMask.LandscapeLeft.rawValue) | Int(UIInterfaceOrientationMask.LandscapeRight.rawValue)
    }
}
